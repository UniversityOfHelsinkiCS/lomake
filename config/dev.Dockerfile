FROM node:24-alpine

ENV TZ=Europe/Helsinki
# Setup
WORKDIR /usr/src/app

COPY package* .
COPY .npmrc .

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]