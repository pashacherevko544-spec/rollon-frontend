const crypto = require('crypto');
const jwt    = require('jsonwebtoken');
const db     = require('../config/database');

class GameProviderService {
  constructor() {
    this.providers = {
      BNG: {
        baseUrl:       'https://api.bgaming-network.com',
        gameLaunchUrl: 'https://static.bgaming-network.com/games',
        imageUrl:      'https://static.bgaming-network.com/games/{id}/en_US/web/desktop/preview.png',
        demoUrl:       'https://static.bgaming-network.com/games/{id}/en_US/web/desktop/game.html',
      },
      PP: {
        baseUrl:       'https://api.pragmaticplay.net',
        gameLaunchUrl: 'https://demogamesfree.pragmaticplay.net',
        imageUrl:      'https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/{id}.png',
        demoUrl:       'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol={id}',
      },
    };
  }

  // ── Launch Game ─────────────────────────────────────────────
  async launchGame(userId, gameId, provider, mode = 'real') {
    const { rows: balRows } = await db.query(
      'SELECT real_balance FROM balances WHERE user_id = $1 AND currency = $2',
      [userId, 'USDT']
    );
    if (!balRows.length) throw new Error('Баланс не знайдено');

    const roundId = crypto.randomUUID();

    await db.query(
      `INSERT INTO game_rounds (round_id, user_id, game_id, provider_id, status)
       VALUES ($1,$2,$3,$4,'active')`,
      [roundId, userId, gameId, provider]
    );

    const launchToken = this.generateLaunchToken(userId, roundId);
    const gameUrl     = this.buildGameUrl(provider, gameId, mode, launchToken);

    return {
      url:      gameUrl,
      roundId,
      balance:  balRows[0].real_balance,
    };
  }

  buildGameUrl(provider, gameId, mode, token) {
    const cfg = this.providers[provider];
    if (!cfg) throw new Error(`Unknown provider: ${provider}`);
    if (mode === 'demo') return cfg.demoUrl.replace('{id}', gameId);
    return `${cfg.gameLaunchUrl}/game?game=${gameId}&token=${token}`;
  }

  generateLaunchToken(userId, roundId) {
    return jwt.sign(
      { userId, roundId, timestamp: Date.now() },
      process.env.GAME_LAUNCH_SECRET,
      { expiresIn: '5m' }
    );
  }

  getImageUrl(provider, gameId) {
    const cfg = this.providers[provider];
    if (!cfg) return null;
    return cfg.imageUrl.replace('{id}', gameId);
  }

  // ── Handle Callback (bet / win) ─────────────────────────────
  async handleGameCallback(provider, data) {
    const { roundId, transactionId, amount, type, currency } = data;

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Lock round row
      const { rows: roundRows } = await client.query(
        'SELECT * FROM game_rounds WHERE round_id = $1 FOR UPDATE',
        [roundId]
      );
      if (!roundRows.length) throw new Error('Round not found');
      const round  = roundRows[0];
      const userId = round.user_id;

      // Lock balance row
      const { rows: balRows } = await client.query(
        'SELECT * FROM balances WHERE user_id = $1 AND currency = $2 FOR UPDATE',
        [userId, currency]
      );
      if (!balRows.length) throw new Error('Balance not found');
      const bal = balRows[0];

      const newBalance = type === 'bet'
        ? parseFloat(bal.real_balance) - parseFloat(amount)
        : parseFloat(bal.real_balance) + parseFloat(amount);

      if (newBalance < 0) throw new Error('Insufficient balance');

      // Insert transaction
      const { rows: txRows } = await client.query(
        `INSERT INTO transactions
           (transaction_uuid, user_id, type, amount, currency,
            balance_before, balance_after, status, provider_id, round_id, transaction_ref)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'completed',$8,$9,$10)
         RETURNING id`,
        [transactionId, userId, type, amount, currency,
         bal.real_balance, newBalance, provider, roundId, data.transactionRef]
      );
      const txId = txRows[0].id;

      // Optimistic balance update
      const { rowCount } = await client.query(
        `UPDATE balances
         SET real_balance = $1, last_transaction_id = $2, version = version + 1
         WHERE user_id = $3 AND currency = $4 AND version = $5`,
        [newBalance, txId, userId, currency, bal.version]
      );
      if (rowCount === 0) throw new Error('Balance version conflict — retry');

      // Bet history
      await client.query(
        `INSERT INTO bet_history
           (round_id, user_id, game_id, bet_amount, win_amount, transaction_id)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [round.id, userId, round.game_id,
         type === 'bet' ? amount : 0,
         type === 'win' ? amount : 0,
         txId]
      );

      // Complete round
      if (type === 'win' || data.roundComplete) {
        await client.query(
          `UPDATE game_rounds SET status = 'completed', ended_at = NOW() WHERE round_id = $1`,
          [roundId]
        );
      }

      await client.query('COMMIT');
      return { success: true, balance: newBalance };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ── Get Games List ──────────────────────────────────────────
  async getGames({ provider, genre, limit = 50, offset = 0 }) {
    let query  = 'SELECT * FROM games WHERE is_active = true';
    const params = [];
    if (provider) { params.push(provider); query += ` AND provider = $${params.length}`; }
    if (genre)    { params.push(genre);    query += ` AND genre = $${params.length}`; }
    query += ` ORDER BY name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const { rows } = await db.query(query, params);
    return rows;
  }
}

module.exports = new GameProviderService();
