STREAMING_CHUNK:Initializing base image

FROM node:18-bullseye-slim

STREAMING_CHUNK:Installing dependencies and NBC compiler

RUN apt-get update && apt-get install -y wget libc6-i386

RUN wget -q "https://sourceforge.net/projects/bricxcc/files/NBC_NXC/NBC%20release%201.2.1%20r4/nbc-1.2.1.r4.tgz/download" -O nbc.tgz 

&& tar -xzf nbc.tgz 

&& mv nbc /usr/local/bin/ 

&& chmod +x /usr/local/bin/nbc 

&& rm nbc.tgz

STREAMING_CHUNK:Setting up the application

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]