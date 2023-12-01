FROM node:21-alpine
WORKDIR /discordbot

COPY package.json ./
RUN npm install && npm cache clean --force
ENV PATH=/discordbot/node_modules/.bin:$PATH

WORKDIR /discordbot/dev
COPY tsconfig.json ./

COPY src ./src
COPY .env ./

EXPOSE 9001

CMD ["npm", "run", "dev"]