FROM node:22-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:./data/app.db

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


COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID

ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL

ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL

RUN npx prisma generate
RUN npx prisma db push
RUN pnpm approve-builds
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
COPY --from=build --chown=nextjs:nodejs /app/node_modules/.pnpm/better-sqlite3@12.6.2/node_modules/better-sqlite3 ./node_modules/.pnpm/better-sqlite3@12.6.2/node_modules/better-sqlite3
COPY --from=build --chown=nextjs:nodejs /app/data ./data
COPY --from=build --chown=nextjs:nodejs /app/src/backend ./src/backend

RUN chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3001
CMD ["node", "server.js"]