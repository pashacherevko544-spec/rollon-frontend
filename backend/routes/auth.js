const express     = require('express');
const router      = express.Router();
const authService = require('../services/authService');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'];
    const ua = req.headers['user-agent'];
    const result = await authService.login(email, password, ip, ua);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await authService.logout(token);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
  try {
    await authService.verifyEmail(req.params.token);
    res.redirect(`${process.env.SITE_URL}?verified=1`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    await authService.requestPasswordReset(req.body.email);
    res.json({ success: true, message: 'Якщо email існує — лист відправлено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const db = require('../config/database');
    const { rows } = await db.query(
      `SELECT u.id, u.email, u.username, u.first_name, u.last_name,
              u.is_verified, u.kyc_status, u.role,
              b.real_balance, b.bonus_balance
       FROM users u
       LEFT JOIN balances b ON b.user_id = u.id AND b.currency = 'USDT'
       WHERE u.id = $1`,
      [req.user.userId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Користувача не знайдено' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
