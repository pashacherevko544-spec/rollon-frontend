const bcrypt       = require('bcrypt');
const jwt          = require('jsonwebtoken');
const crypto       = require('crypto');
const db           = require('../config/database');
const emailService = require('./emailService');

class AuthService {
  constructor() {
    this.saltRounds   = 12;
    this.jwtSecret    = process.env.JWT_SECRET;
    this.refreshSecret = process.env.REFRESH_SECRET;
  }

  // ── Register ────────────────────────────────────────────────
  async register({ email, username, password, firstName, lastName, dateOfBirth }) {
    const salt         = await bcrypt.genSalt(this.saltRounds);
    const passwordHash = await bcrypt.hash(password + salt, this.saltRounds);
    const verToken     = crypto.randomBytes(32).toString('hex');
    const tokenExpiry  = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO users
           (email, username, password_hash, salt, first_name, last_name, date_of_birth)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [email, username, passwordHash, salt, firstName, lastName, dateOfBirth]
      );
      const userId = rows[0].id;

      await client.query(
        `INSERT INTO email_verifications (user_id, token, expires_at) VALUES ($1,$2,$3)`,
        [userId, verToken, tokenExpiry]
      );

      await client.query(
        `INSERT INTO balances (user_id, currency, real_balance) VALUES ($1,'USDT',0)`,
        [userId]
      );

      await client.query('COMMIT');

      emailService.sendEmail(email, 'verification', {
        username,
        verificationLink: `${process.env.SITE_URL}/verify/${verToken}`,
        expiresIn: '24 години',
      }).catch(err => console.error('[Email] Verification failed:', err));

      return { userId, email, username };
    } catch (err) {
      await client.query('ROLLBACK');
      if (err.code === '23505') {
        const field = err.detail?.includes('email') ? 'email' : 'username';
        throw Object.assign(new Error(`${field} вже використовується`), { code: 'DUPLICATE' });
      }
      throw err;
    } finally {
      client.release();
    }
  }

  // ── Login ───────────────────────────────────────────────────
  async login(email, password, ipAddress, userAgent) {
    const { rows } = await db.query(
      `SELECT u.*, b.real_balance, b.bonus_balance
       FROM users u
       LEFT JOIN balances b ON u.id = b.user_id AND b.currency = 'USDT'
       WHERE u.email = $1 AND u.is_active = true`,
      [email]
    );

    if (!rows.length) throw new Error('Невірний email або пароль');
    const user = rows[0];

    if (user.is_locked) throw new Error('Акаунт заблоковано. Зверніться до підтримки.');

    const isValid = await bcrypt.compare(password + user.salt, user.password_hash);
    if (!isValid) {
      await this.logFailedAttempt(user.id, ipAddress);
      throw new Error('Невірний email або пароль');
    }

    if (user.two_factor_enabled) {
      return { requires2FA: true, userId: user.id };
    }

    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    await db.query(
      `UPDATE users SET last_login = NOW(), last_ip = $1 WHERE id = $2`,
      [ipAddress, user.id]
    );

    await this.auditLog(user.id, 'login', 'user', user.id, null, { ip: ipAddress }, ipAddress, userAgent);

    return {
      user: {
        id:       user.id,
        email:    user.email,
        username: user.username,
        balance: {
          real:  user.real_balance  || 0,
          bonus: user.bonus_balance || 0,
        },
      },
      ...tokens,
    };
  }

  // ── Generate JWT Tokens ─────────────────────────────────────
  async generateTokens(user, ipAddress, userAgent) {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      this.refreshSecret,
      { expiresIn: '7d' }
    );

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO user_sessions
         (user_id, session_token, refresh_token, ip_address, user_agent, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [user.id, accessToken, refreshToken, ipAddress, userAgent, expires]
    );

    return { accessToken, refreshToken };
  }

  // ── Refresh Token ───────────────────────────────────────────
  async refreshToken(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, this.refreshSecret);
    } catch {
      throw new Error('Невірний або прострочений refresh token');
    }

    const { rows } = await db.query(
      `SELECT us.*, u.email, u.role FROM user_sessions us
       JOIN users u ON u.id = us.user_id
       WHERE us.refresh_token = $1 AND us.expires_at > NOW()`,
      [refreshToken]
    );
    if (!rows.length) throw new Error('Сесія не знайдена');

    const session = rows[0];
    const newAccessToken = jwt.sign(
      { userId: payload.userId, email: session.email, role: session.role },
      this.jwtSecret,
      { expiresIn: '15m' }
    );

    await db.query(
      `UPDATE user_sessions SET session_token = $1 WHERE refresh_token = $2`,
      [newAccessToken, refreshToken]
    );

    return { accessToken: newAccessToken };
  }

  // ── Verify Email ────────────────────────────────────────────
  async verifyEmail(token) {
    const { rows } = await db.query(
      `SELECT user_id, expires_at FROM email_verifications
       WHERE token = $1 AND used = false`,
      [token]
    );
    if (!rows.length) throw new Error('Невірний або прострочений токен');
    if (new Date() > rows[0].expires_at) throw new Error('Токен прострочений');

    const userId = rows[0].user_id;
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query(`UPDATE users SET is_verified = true WHERE id = $1`, [userId]);
      await client.query(`UPDATE email_verifications SET used = true WHERE token = $1`, [token]);
      await client.query('COMMIT');

      const { rows: user } = await db.query(
        'SELECT email, username FROM users WHERE id = $1', [userId]
      );
      emailService.sendEmail(user[0].email, 'welcome', { username: user[0].username }).catch(console.error);
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ── Password Reset ──────────────────────────────────────────
  async requestPasswordReset(email) {
    const { rows } = await db.query(
      'SELECT id, username FROM users WHERE email = $1', [email]
    );
    if (!rows.length) return true; // don't reveal

    const token    = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
      `INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1,$2,$3)`,
      [rows[0].id, token, expiresAt]
    );

    await emailService.sendEmail(email, 'passwordReset', {
      username:  rows[0].username,
      resetLink: `${process.env.SITE_URL}/reset-password/${token}`,
      expiresIn: '1 година',
    });
    return true;
  }

  async resetPassword(token, newPassword) {
    const { rows } = await db.query(
      `SELECT user_id FROM password_resets
       WHERE token = $1 AND used = false AND expires_at > NOW()`,
      [token]
    );
    if (!rows.length) throw new Error('Невірний або прострочений токен');

    const userId = rows[0].user_id;
    const salt   = await bcrypt.genSalt(this.saltRounds);
    const hash   = await bcrypt.hash(newPassword + salt, this.saltRounds);

    await db.query(
      `UPDATE users SET password_hash = $1, salt = $2 WHERE id = $3`,
      [hash, salt, userId]
    );
    await db.query(
      `UPDATE password_resets SET used = true WHERE token = $1`, [token]
    );
    return true;
  }

  // ── Logout ──────────────────────────────────────────────────
  async logout(accessToken) {
    await db.query(
      'DELETE FROM user_sessions WHERE session_token = $1', [accessToken]
    );
    return true;
  }

  // ── Helpers ─────────────────────────────────────────────────
  async logFailedAttempt(userId, ipAddress) {
    await this.auditLog(userId, 'failed_login', 'user', userId, null, { ip: ipAddress }, ipAddress);

    // Lock after 5 failed attempts in 15 min
    const { rows } = await db.query(
      `SELECT COUNT(*) FROM audit_log
       WHERE user_id = $1 AND action = 'failed_login'
         AND created_at > NOW() - INTERVAL '15 minutes'`,
      [userId]
    );
    if (parseInt(rows[0].count) >= 5) {
      await db.query('UPDATE users SET is_locked = true WHERE id = $1', [userId]);
      console.warn(`[Auth] User ${userId} locked after 5 failed attempts`);
    }
  }

  async auditLog(userId, action, entityType, entityId, oldVal, newVal, ip, ua) {
    await db.query(
      `INSERT INTO audit_log
         (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [userId, action, entityType, String(entityId),
       oldVal ? JSON.stringify(oldVal) : null,
       newVal ? JSON.stringify(newVal) : null,
       ip, ua]
    ).catch(() => {});
  }
}

module.exports = new AuthService();
