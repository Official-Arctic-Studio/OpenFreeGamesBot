FROM node:latest
USER root

RUN apt-get update && apt-get install -y git && apt-get clean

WORKDIR /app/FreeGamesBot

ADD ./ ./

RUN npm install

CMD npm run api & npm run bot
