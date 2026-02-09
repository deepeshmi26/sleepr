FROM node:22-alpine

WORKDIR /user/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

CMD ["pnpm", "test"]
