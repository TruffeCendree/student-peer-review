FROM node:16-stretch

ENV NODE_ENV=production

WORKDIR /app

ADD . /app

RUN npm ci --include=dev && npm run build && npm prune

CMD ["npm", "run", "start"]
