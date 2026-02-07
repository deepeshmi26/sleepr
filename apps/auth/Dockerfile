# -------- Base --------
FROM node:18-alpine AS base
WORKDIR /user/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json nest-cli.json ./

# -------- Dependencies --------
FROM base AS deps
RUN pnpm install -r --frozen-lockfile

FROM deps AS development
COPY apps/auth apps/auth
COPY libs libs

# -------- Build --------
FROM development AS build
RUN pnpm run build auth

# -------- Production --------
FROM node:18-alpine AS production
WORKDIR /user/src/app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /user/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]
