FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN \
    mkdir -p public/attachments && \
    mkdir -p public/backup/archive && \
    mkdir -p public/backup/excel && \
    mkdir -p public/backup/json && \
    mkdir -p public/import/archive && \
    mkdir -p public/import/collections && \
    chmod -R 775 public

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
