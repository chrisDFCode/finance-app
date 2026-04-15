# Docker Build & Run Instructions

## Build Docker Image

```bash
# Build the image
docker build -t finance-app:latest .

# Or with build arguments
docker build -t finance-app:1.0 \
  --build-arg VITE_SUPABASE_URL=your_url \
  --build-arg VITE_SUPABASE_ANON_KEY=your_key .
```

## Run Docker Container

### Basic Run
```bash
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  finance-app:latest
```

### Run with Docker Compose
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your Supabase credentials
nano .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Run in Development Mode
```bash
docker-compose -f docker-compose.yml up -d --build
```

## Docker Commands Cheat Sheet

```bash
# Build
docker build -t finance-app .

# Run
docker run -p 3000:3000 finance-app

# List images
docker images

# List containers
docker ps

# View logs
docker logs container_id

# Stop container
docker stop container_id

# Remove image
docker rmi finance-app

# Push to Docker Hub
docker tag finance-app:latest username/finance-app:latest
docker push username/finance-app:latest
```

## Environment Variables in Docker

Pass environment variables using `-e` flag:

```bash
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your_anon_key \
  finance-app:latest
```

Or use a `.env` file:

```bash
docker run -p 3000:3000 \
  --env-file .env \
  finance-app:latest
```

## Deploy to Cloud

### Deploy to Google Cloud Run
```bash
# Build and tag
docker build -t gcr.io/your-project/finance-app .

# Push to GCR
docker push gcr.io/your-project/finance-app

# Deploy
gcloud run deploy finance-app \
  --image gcr.io/your-project/finance-app \
  --region us-central1 \
  --set-env-vars VITE_SUPABASE_URL=your_url,VITE_SUPABASE_ANON_KEY=your_key
```

### Deploy to AWS ECR
```bash
# Create ECR repository
aws ecr create-repository --repository-name finance-app

# Build and tag
docker build -t 123456789.dkr.ecr.us-east-1.amazonaws.com/finance-app .

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/finance-app
```

### Deploy to Docker Hub
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag finance-app:latest username/finance-app:latest

# Push
docker push username/finance-app:latest
```

## Health Check

The Dockerfile includes a health check that verifies the app is running:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1
```

Check container health:
```bash
docker ps --format "table {{.ID}}\t{{.Status}}"
```

## Docker File Explanation

### Multi-Stage Build
1. **Stage 1 (Builder)**: Install dependencies and build the app
2. **Stage 2 (Runtime)**: Copy only the built files, creating a smaller image

### Benefits
- Smaller final image size (~50% reduction)
- Better security (no build dependencies in production)
- Faster deployments
- Cleaner production environment

## Troubleshooting

### Port Already in Use
```bash
# Use different port
docker run -p 8000:3000 finance-app
```

### Environment Variables Not Set
```bash
# Check running containers
docker inspect container_id

# View environment
docker exec container_id env
```

### App Crashes
```bash
# View logs
docker logs container_id

# Get detailed logs
docker logs --follow container_id
```

### Out of Memory
```bash
# Run with memory limit
docker run -m 512m finance-app
```

## Performance Tips

- Use Alpine Linux base (lightweight)
- Multi-stage build (smaller final image)
- Layer caching for faster rebuilds
- Health checks for container management
- Resource limits to prevent crashes

## Security Best Practices

- Don't hardcode secrets in Dockerfile
- Use environment variables for sensitive data
- Run as non-root user (if needed)
- Scan images for vulnerabilities:
  ```bash
  docker scan finance-app
  ```
- Keep base images updated
- Use specific versions (avoid `latest`)
