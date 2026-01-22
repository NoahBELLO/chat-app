FROM node:22-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Install pnpm globally once
RUN npm install -g pnpm
RUN mkdir -p /app/data

# Dependencies stage
FROM base AS dependencies

COPY package.json ./
RUN pnpm install

# Build stage
FROM base AS build

ENV DATABASE_URL=file:./data/app.db

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npx prisma db push
RUN pnpm run build

# Production stage
FROM base AS run

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/.next && chown -R nextjs:nodejs /app

COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build --chown=nextjs:nodejs /app/data ./data
COPY --from=build --chown=nextjs:nodejs /app/src/backend ./src/backend

RUN chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3001
CMD ["node", "server.js"]