module.exports = {
  apps: [{
    name: "socket-chat-msc",
    script: "./bin/www.js",
    watch: ["./.git/*", "./.idea/*", "./*.js", "./lib/*.js", "./public/js/*.js", "./views/**/*.ejs"],
    ignore_watch: [/(^|[\/\\])\../, "./logs/*", "./.git/*", "./.idea/*", "./node_modules/*"],
    cwd: "C:\\tmp\\socket-chat-msc",
    instances: 2,
    merge_logs: true,
    kill_timeout: 1600,
    wait_ready: true,
    listen_timeout: 3000,
    output: "./logs/pm2-out.log",
    error: "./logs/pm2-error.log",
    env: {
      HOST: "localhost",
      PORT: 2000,
      NODE_ENV: "development"
    },
    env_production: {
      HOST: "your.live.server.com",
      PORT: 80,
      NODE_ENV: "production"
    }
  }],

  deploy: {
    production: {
      key: "/path/to/local/.ssh",
      user: "SSH user",
      host: "SSH host",
      ssh_options: "StrictHostKeyChecking=no",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "/path/on/server/to/var/www/production",
      "pre-setup": "echo 'This is a local executed command'",
      "post-setup": "/path/to/remote/post-setup.sh",
      "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
};
