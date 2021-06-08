FROM 559165824181.dkr.ecr.us-east-2.amazonaws.com/node:latest as build-step

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["npm" ,"run" ,"start"]
