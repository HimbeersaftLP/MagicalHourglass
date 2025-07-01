FROM node:24.3.0-slim

WORKDIR /home/node/app

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

USER node

ENV NODE_ENV="production"

COPY package*.json ./

RUN npm install

COPY . .

RUN mv defaults.docker.js defaults.js

CMD [ "node", "src/bot.js" ]