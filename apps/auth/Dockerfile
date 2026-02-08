FROM node:18-alpine As development

WORKDIR /user/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY apps/auth/package.json ./apps/auth/package.json
COPY apps/auth/pnpm-lock.yaml ./apps/auth/pnpm-lock.yaml
RUN pnpm install -r

RUN npm install -g pnpm 

COPY apps/auth apps/auth
COPY libs libs


RUN pnpm run build auth

FROM node:18-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install --prod

COPY --from=development /user/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]