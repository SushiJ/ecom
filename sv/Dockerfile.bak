FROM node:lts-alpine as builder
WORKDIR /usr/src/app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:slim
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /usr/src/app/dist /dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
