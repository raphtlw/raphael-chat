FROM node:14

WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

ENTRYPOINT [ "node", "dist/main.js" ]