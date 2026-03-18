const jwt = require('jsonwebtoken');
const db  = require('../config/database');

// ── Verify Access Token ─────────────────────────────────────
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Токен не надано' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Check session is still alive
    const { rows } = await db.query(
      `SELECT us.id FROM user_sessions us
       WHERE us.session_token = $1 AND us.expires_at > NOW()`,
      [token]
    );
    if (!rows.length) return res.status(401).json({ error: 'Сесія завершена' });

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Невірний або прострочений токен' });
  }
};

// ── Require Admin Role ──────────────────────────────────────
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Недостатньо прав' });
  }
  next();
};

module.exports = { authenticate, requireAdmin };
