FROM registry.access.redhat.com/ubi8/nodejs-20

ENV TZ=Europe/Helsinki

WORKDIR /opt/app-root/src

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

ARG SENTRY_ENVIRONMENT
ENV SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT

COPY package* ./
RUN npm ci -f --omit-dev --ignore-scripts --no-audit --no-fund
COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
