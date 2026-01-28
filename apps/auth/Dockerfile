FROM node:alpine as development

WORKDIR /user/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
RUN npm install -g pnpm 

RUN pnpm install

COPY apps/auth apps/auth
COPY libs libs

RUN cd apps/auth && pnpm install

RUN pnpm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /user/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY --from=development /user/src/app/dist ./dist

CMD ["node", "dist/apps/users/main"]
