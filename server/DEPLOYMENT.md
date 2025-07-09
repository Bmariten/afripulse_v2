# Deployment Guide for Niche Market Canvas API

This guide describes how to deploy the Niche Market Canvas API to a production environment.

## Prerequisites

- Node.js 16+ and npm
- MySQL 8+ database server
- Git (for version control and deployment)

## Environment Setup

1. Clone the repository:
   ```
   git clone [repository-url]
   cd niche-market-canvas-main/server
   ```

2. Install dependencies:
   ```
   npm install --production
   ```

3. Set up environment variables by creating a `.env` file:
   ```
   # Use the provided .env.example as a template
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   ```

   **Important:** Make sure to set a strong `JWT_SECRET` for production.

## Database Setup

1. Create a production database:
   ```sql
   CREATE DATABASE afripulse;
   CREATE USER 'afripulse_user'@'localhost' IDENTIFIED BY 'your_strong_password';
   GRANT ALL PRIVILEGES ON afripulse.* TO 'afripulse_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Update the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=afripulse_user
   DB_PASSWORD=your_strong_password
   DB_NAME=afripulse
   ```

3. Run database migrations:
   ```
   npm run migrate
   ```

## Production Configuration

1. Set production environment variables:
   ```
   NODE_ENV=production
   PORT=3001  # Or your preferred port
   ```

2. Configure your web server (Nginx/Apache) to proxy requests to your Node.js application.

### Sample Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.yourdomainname.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Running the Application

### Using PM2 (recommended)

1. Install PM2 globally:
   ```
   npm install -g pm2
   ```

2. Start the application:
   ```
   pm2 start npm --name "afripulse-api" -- start
   ```

3. Configure PM2 to start on system boot:
   ```
   pm2 startup
   pm2 save
   ```

### Using Systemd

Create a systemd service file:

```ini
[Unit]
Description=AfriPulse API Service
After=network.target

[Service]
Type=simple
User=yourusername
WorkingDirectory=/path/to/niche-market-canvas-main/server
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Save this to `/etc/systemd/system/afripulse-api.service`, then:

```bash
sudo systemctl enable afripulse-api
sudo systemctl start afripulse-api
```

## Security Considerations

1. Ensure your `.env` file with sensitive credentials is not exposed
2. Enable HTTPS on your web server
3. Consider using a web application firewall (WAF)
4. Regularly update dependencies with `npm audit fix`
5. Monitor your application logs for suspicious activity

## Monitoring and Maintenance

- Application logs are stored in the `logs` directory
- For monitoring, consider integrating with services like New Relic, Datadog, or Sentry
- Set up regular database backups

## Troubleshooting

- Check application logs in `logs/` directory
- Verify database connection is working
- Ensure all environment variables are correctly set
