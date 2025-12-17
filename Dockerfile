FROM node:slim

ARG DATABASE_URL

WORKDIR /bot

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

ENV DATABASE_URL=${DATABASE_URL}

RUN pnpm run build

CMD ["pnpm", "start"]
