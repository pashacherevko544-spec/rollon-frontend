const nodemailer = require('nodemailer');
const fs         = require('fs').promises;
const path       = require('path');
const handlebars = require('handlebars');
const smtpConfig = require('../config/smtp');
const db         = require('../config/database');

class EmailService {
  constructor() {
    this.transporters = {
      default: this.createTransporter(smtpConfig.default),
      backup:  smtpConfig.backup.host
        ? this.createTransporter(smtpConfig.backup)
        : null,
    };
    this.currentTransporter = 'default';
    this.templates = new Map();
    this.loadTemplates();
  }

  createTransporter(config) {
    return nodemailer.createTransport({
      host:    config.host,
      port:    config.port,
      secure:  config.secure || false,
      auth:    config.auth,
      pool:    true,
      maxConnections: 5,
      maxMessages:    100,
      rateDelta:      1000,
      rateLimit:      smtpConfig.rateLimit.maxPerMinute,
    });
  }

  async loadTemplates() {
    const templateDir = path.join(__dirname, '../templates/email');
    for (const [key, value] of Object.entries(smtpConfig.templates)) {
      try {
        const filePath = path.join(templateDir, value.template);
        const content  = await fs.readFile(filePath, 'utf-8');
        this.templates.set(key, {
          subject:  value.subject,
          template: handlebars.compile(content),
        });
      } catch {
        // Template file missing — use inline fallback
        this.templates.set(key, {
          subject:  value.subject,
          template: handlebars.compile(this.fallbackTemplate(key)),
        });
      }
    }
  }

  fallbackTemplate(key) {
    return `<html><body style="font-family:sans-serif;background:#0f212e;color:#fff;padding:40px">
      <h2 style="color:#00d4aa">ROLLON Casino</h2>
      <p>{{message}}</p>
      {{#if verificationLink}}<a href="{{verificationLink}}" style="background:#00d4aa;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none">Підтвердити</a>{{/if}}
      {{#if resetLink}}<a href="{{resetLink}}" style="background:#ef4444;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Скинути пароль</a>{{/if}}
      <p style="color:#8a9bb0;font-size:12px;margin-top:40px">© {{year}} ROLLON Casino</p>
    </body></html>`;
  }

  async sendEmail(to, templateKey, data = {}, attachments = []) {
    const template = this.templates.get(templateKey);
    if (!template) throw new Error(`Template ${templateKey} not found`);

    const html = template.template({
      ...data,
      year:         new Date().getFullYear(),
      siteUrl:      process.env.SITE_URL,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@rollon.casino',
    });

    const mailOptions = {
      from:        smtpConfig.default.from,
      to,
      subject:     template.subject,
      html,
      attachments,
      headers: {
        'X-Priority':        '1',
        'X-MSMail-Priority': 'High',
        Importance:          'high',
      },
    };

    return this.sendWithRetry(mailOptions);
  }

  async sendWithRetry(mailOptions, attempt = 1) {
    try {
      const transporter = this.transporters[this.currentTransporter];
      const info = await transporter.sendMail(mailOptions);
      await this.logEmail(mailOptions.to, mailOptions.subject, 'success', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      if (this.currentTransporter === 'default' && this.transporters.backup) {
        this.currentTransporter = 'backup';
        return this.sendWithRetry(mailOptions, attempt);
      }
      if (attempt < smtpConfig.retry.attempts) {
        const delay = smtpConfig.retry.backoff === 'exponential'
          ? smtpConfig.retry.initialDelay * Math.pow(2, attempt - 1)
          : smtpConfig.retry.initialDelay * attempt;
        await new Promise(r => setTimeout(r, delay));
        return this.sendWithRetry(mailOptions, attempt + 1);
      }
      await this.logEmail(mailOptions.to, mailOptions.subject, 'failed', null, error.message);
      throw error;
    }
  }

  async logEmail(recipient, subject, status, messageId, error = null) {
    try {
      await db.query(
        `INSERT INTO email_logs (recipient, subject, status, message_id, error)
         VALUES ($1, $2, $3, $4, $5)`,
        [recipient, subject, status, messageId, error]
      );
    } catch { /* non-critical */ }
  }
}

module.exports = new EmailService();
