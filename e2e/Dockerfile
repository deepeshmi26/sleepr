FROM node:alpine 

WORKDIR /user/src/app

COPY . .

RUN npm install -g pnpm 

RUN pnpm install --force

CMD ["pnpm", "test"]