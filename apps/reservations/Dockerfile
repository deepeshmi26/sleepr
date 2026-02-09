FROM node:18-alpine As development

WORKDIR /user/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY apps/reservations/package.json ./apps/reservations/package.json
COPY apps/reservations/pnpm-lock.yaml ./apps/reservations/pnpm-lock.yaml
RUN npm install -g pnpm 
RUN pnpm install -r

COPY apps/reservations apps/reservations
COPY libs libs

RUN pnpm run build reservations

FROM node:18-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install --prod

COPY --from=development /user/src/app/dist ./dist

CMD ["node", "dist/apps/reservations/main"]