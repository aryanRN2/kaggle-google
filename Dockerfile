# --- Stage 1: Build the Next.js Frontend ---
FROM node:20-alpine AS builder
WORKDIR /app/romer-dashboard
COPY romer-dashboard/package*.json ./
RUN npm ci
COPY romer-dashboard/ ./
RUN npm run build

# --- Stage 2: Production Runtime Env ---
FROM python:3.11-slim
WORKDIR /app

# Install Node.js runtime for the production Next.js server
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend.py mcp_server.py ./
RUN mkdir -p sandbox

# Copy production frontend files from builder
COPY --from=builder /app/romer-dashboard /app/romer-dashboard

# Create startup script to run the Python server internally on port 8000
# and bind the Next.js frontend to the dynamically assigned Cloud Run $PORT
RUN echo '#!/bin/sh\n\
python3 -m uvicorn backend:app --host 127.0.0.1 --port 8000 &\n\
cd romer-dashboard && npm run start -- -p ${PORT:-8080}\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start using the unified launcher script
CMD ["/app/start.sh"]
