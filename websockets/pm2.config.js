module.exports = {
  apps: [
    {
      name: 'websockets',
      script: './src/index.js',
      instances: 'max', // Aprovecha todos los cores de la CPU
      exec_mode: 'cluster', // Modo cluster para alto volumen
      autorestart: true,
      watch: ['./src'],
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    }
  ]
};