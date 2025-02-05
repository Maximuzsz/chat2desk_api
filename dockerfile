# Use uma imagem base do Node.js
FROM node:20

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install --build-from-source

# Baixe o script wait-for-it.sh para garantir que o PostgreSQL esteja pronto
RUN curl -sSL https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh -o /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copie o código da aplicação para o diretório de trabalho
COPY . .

# Compile o código TypeScript antes de rodar a aplicação
RUN npm run build

RUN npm rebuild bcrypt

# Exponha a porta da aplicação
EXPOSE 3000

# Inicie a aplicação, aguardando o PostgreSQL estar pronto
CMD ["/wait-for-it.sh", "postgres:5432", "--", "npm", "run", "start:prod"]
