STREAMING_CHUNK:Initializing base image...

Node.jsが動く軽量なLinux環境をベースにする

FROM node:18-bullseye-slim

STREAMING_CHUNK:Installing dependencies and NBC compiler...

NBCコンパイラ（古い32bitバイナリ）を動かすためのライブラリと、ダウンロード用のwgetをインストール

RUN apt-get update && apt-get install -y wget libc6-i386

SourceForgeからNXT用のNBC/NXCコンパイラ（Linux版）をダウンロードしてインストール

RUN wget -q "https://sourceforge.net/projects/bricxcc/files/NBC_NXC/NBC%20release%201.2.1%20r4/nbc-1.2.1.r4.tgz/download" -O nbc.tgz 

&& tar -xzf nbc.tgz 

&& mv nbc /usr/local/bin/ 

&& chmod +x /usr/local/bin/nbc 

&& rm nbc.tgz

STREAMING_CHUNK:Setting up the application...

作業ディレクトリの設定

WORKDIR /app

依存関係パッケージのインストール

COPY package*.json ./
RUN npm install

サーバーのソースコードとフロントエンド(publicフォルダ)をコピー

COPY . .

Renderが指定するポートを開放

EXPOSE 3000

サーバー起動コマンド

CMD ["npm", "start"]