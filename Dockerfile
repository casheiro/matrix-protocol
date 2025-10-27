# Multi-stage build for Matrix Protocol Website v2
FROM node:22-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build

# Set CI environment to avoid interactive prompts
ENV CI=true
# Increase Node.js memory limit for build
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY website .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine AS runtime

# Install pnpm globally and curl for healthcheck
RUN npm install -g pnpm && apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Set working directory
WORKDIR /app

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application from build stage
COPY --from=build --chown=nuxtjs:nodejs /app/.output ./.output

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV NITRO_PORT=5000
ENV NITRO_HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]