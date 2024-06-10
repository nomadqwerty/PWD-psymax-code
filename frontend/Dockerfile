FROM node:20.8.1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create a build
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set the port on which the application will listen
ENV PORT 3000
# Set required environment variables
ENV NEXT_PUBLIC_PRICING_GLOBAL 69
ENV NEXT_PUBLIC_PRICING_GLOBAL_EXTENDED 99
ENV NEXT_PUBLIC_PRICING_VAT_PERCENTAGE 19
ENV NEXT_DAYS_PER_CYCLE 28

EXPOSE 3000

CMD ["npm", "start"]
