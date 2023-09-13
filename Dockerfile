FROM registry.access.redhat.com/ubi8/nodejs-16

ENV TZ=Europe/Helsinki

WORKDIR /opt/app-root/src

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

ARG SENTRY_ENVIRONMENT
ENV SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT

ARG BUILT_AT
ENV REACT_APP_BUILT_AT=$BUILT_AT

COPY package* ./
RUN npm ci -f --omit-dev --ignore-scripts --no-audit --no-fund
COPY . .

RUN npm run build

RUN cp index.html build/

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
