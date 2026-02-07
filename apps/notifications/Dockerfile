FROM node:alpine As development

WORKDIR /user/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./
RUN npm install -g pnpm 
RUN pnpm install -r

COPY apps/notifications apps/notifications
COPY libs libs

RUN pnpm run build notifications

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install --prod

COPY --from=development /user/src/app/dist ./dist

CMD ["node", "dist/apps/notifications/main"]