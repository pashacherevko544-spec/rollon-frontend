module.exports = {
  default: {
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'noreply@rollon.casino',
      pass: process.env.SMTP_PASS || '',
    },
    from:    process.env.SMTP_FROM    || 'ROLLON Casino <noreply@rollon.casino>',
    replyTo: process.env.SMTP_REPLY_TO || 'support@rollon.casino',
  },

  backup: {
    host: process.env.SMTP_BACKUP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_BACKUP_PORT) || 587,
    auth: {
      user: process.env.SMTP_BACKUP_USER || 'apikey',
      pass: process.env.SMTP_BACKUP_PASS || '',
    },
  },

  templates: {
    verification: {
      subject:  'Підтвердіть вашу пошту — ROLLON',
      template: 'verification.html',
    },
    welcome: {
      subject:  'Ласкаво просимо до ROLLON Casino!',
      template: 'welcome.html',
    },
    passwordReset: {
      subject:  'Скидання паролю — ROLLON',
      template: 'password-reset.html',
    },
    depositConfirmation: {
      subject:  'Депозит підтверджено — ROLLON',
      template: 'deposit.html',
    },
    withdrawalUpdate: {
      subject:  'Статус виводу — ROLLON',
      template: 'withdrawal.html',
    },
    twoFactor: {
      subject:  'Ваш код 2FA — ROLLON',
      template: '2fa.html',
    },
    securityAlert: {
      subject:  'Попередження безпеки — ROLLON',
      template: 'security.html',
    },
  },

  rateLimit: {
    maxPerMinute: 30,
    maxPerHour:   500,
    maxPerDay:    1000,
  },

  retry: {
    attempts:     3,
    backoff:      'exponential',
    initialDelay: 1000,
  },
};
