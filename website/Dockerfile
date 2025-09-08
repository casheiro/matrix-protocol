# ==============================================
# MATRIX PROTOCOL WEBSITE - DOCKER CONFIGURATION
# ==============================================
# Multi-stage build for optimized production image
# Compatible with Coolify deployment platform

# ==============================================
# BUILD STAGE
# ==============================================
FROM node:20-alpine AS builder

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

# Set working directory
WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application for production
RUN pnpm build

# ==============================================
# PRODUCTION STAGE
# ==============================================
FROM node:20-alpine AS production

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

# Create app user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.output /app/.output

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Start the application
CMD ["node", ".output/server/index.mjs"]