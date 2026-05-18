FROM node:22-alpine

ENV TZ=Europe/Helsinki

WORKDIR /opt/app-root/src

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

ARG SENTRY_ENVIRONMENT
ENV SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT

RUN curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh -s -- --ci
COPY package* ./

RUN npm ci -f --omit-dev --ignore-scripts --no-audit --no-fund
COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
