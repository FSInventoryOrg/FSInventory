FROM node:20.12.2

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=http://192.168.0.110:8000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]