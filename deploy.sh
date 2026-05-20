#!/bin/bash
set -e

APP_PATH="/var/www/html/familytree-web"
SECRET_NAME="familytree-frontend"
REGION="us-east-1"

echo "Starting frontend deployment..."

# Move to application directory
cd $APP_PATH

echo "Fetching frontend env from AWS Secrets Manager..."

# Create .env file before Docker build
aws secretsmanager get-secret-value \
    --region $REGION \
    --secret-id $SECRET_NAME \
    --query SecretString \
    --output text > .env

echo ".env file created successfully."

echo "Cleaning old unused Docker images..."

# Optional cleanup
docker image prune -af || true

echo "Building and restarting frontend container..."

# Build new image and recreate container with minimal downtime
docker compose up -d --build --force-recreate

echo "Setting permissions..."

chmod -R 755 $APP_PATH

echo "Frontend deployment completed successfully."
