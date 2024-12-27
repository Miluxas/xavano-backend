FROM node:20.14.0-slim

ARG SENTRY_AUTH_TOKEN
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

FROM node:20.14.0-alpine

ARG SENTRY_AUTH_TOKEN

WORKDIR /app

COPY --from=0 /app/node_modules ./node_modules

COPY . .

RUN yarn build

CMD yarn start:prod