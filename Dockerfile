FROM node:16.15

WORKDIR /usr/src/app
COPY package* ./ 
RUN npm ci
COPY . .

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

# The commands above dont seem to do the trick, this works locally atleast:
ENV TZ=Europe/Helsinki 

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

ARG SENTRY_ENVIRONMENT
ENV SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
