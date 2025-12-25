module.exports = {
  apps: [
    {
      name: 'educkpro-api',
      script: 'server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      // Restart delay
      restart_delay: 4000,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,
    },
  ],
};
