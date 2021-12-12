FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm i --prod
COPY . .
ENTRYPOINT ["npm" , "start"]
