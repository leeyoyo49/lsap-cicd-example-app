# 使用輕量級的 Node.js 基礎映像檔
FROM node:20-alpine

# 設定工作目錄
WORKDIR /usr/src/app

# 先複製 package 設定檔 (利用 Docker Cache 加速安裝)
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 複製其餘程式碼
COPY . .

# 開放容器內部的 3000 Port
EXPOSE 3000

# 啟動指令
CMD ["node", "app.js"]
