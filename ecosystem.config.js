/**
 * PM2 Ecosystem Config — @SkyNovaTech_Bot
 *
 * Usage:
 *   npm run pm2:start   → start 24/7
 *   npm run pm2:status  → check status
 *   npm run pm2:logs    → view logs
 *   npm run pm2:restart → restart
 *   npm run pm2:stop    → stop
 */
module.exports = {
  apps: [{
    name: 'SkyNovaTech_Bot',
    script: './src/app.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,

    // Memory limit — restart if over 500MB
    max_memory_restart: '500M',

    // Crash recovery — exponential backoff, max 15 restarts
    min_uptime: '10s',
    max_restarts: 15,
    exp_backoff_restart_delay: 100,

    // Scheduled daily restart at 3:00 AM (prevents memory drift)
    cron_restart: '0 3 * * *',

    // Production environment
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },

    // Log files (auto-created in ./logs/)
    error_file: './logs/error.log',
    out_file:   './logs/out.log',
    log_file:   './logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
