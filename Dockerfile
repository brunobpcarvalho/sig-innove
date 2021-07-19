FROM node:13.7.0
ENV NODE_ENV=production

WORKDIR /sig-innove

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD [ "node", "app.js" ]