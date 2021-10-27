FROM node:current-slim

WORKDIR /home/node/app

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

USER node

ENV NODE_ENV="production"

COPY package*.json ./

# RUN npm ci --only=production

RUN npm install

COPY . .

CMD [ "node", "bot.js" ]