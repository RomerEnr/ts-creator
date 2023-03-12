FROM node:18.15-alpine3.16 AS base
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM base as prod
ENV NODE_ENV=production
COPY --from=base /usr/src/app/dist ./dist
RUN npm install
USER node
COPY --chown=node:node . .
EXPOSE 3000
CMD ["node", "dist/index.js"]