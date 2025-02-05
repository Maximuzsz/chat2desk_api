
# Instruções para Subir o Container com Docker e Docker Compose

Este repositório contém a configuração de um projeto que utiliza Docker e Docker Compose para rodar a aplicação, incluindo um banco de dados PostgreSQL e a inicialização de um RabbitMQ.

## Pré-requisitos

Antes de rodar os containers, é necessário ter o Docker e o Docker Compose instalados em sua máquina.

- [Instalar Docker](https://docs.docker.com/get-docker/)
- [Instalar Docker Compose](https://docs.docker.com/compose/install/)

## Passos para Subir os Containers

### 1. Clonar o Repositório

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias, caso ainda não exista. Um exemplo de arquivo `.env` seria:

```
DATABASE_URL="postgresql://admin:Abc123@postgres:5432/2desk?schema=public"
JWT_SECRET=seu-segredo-jwt
RABBITMQ_URL=amqp://localhost
```

### 3. Subir os Containers

Use o Docker Compose para construir e subir os containers necessários (PostgreSQL, RabbitMQ e a aplicação):

```bash
docker-compose up --build
```

O comando acima irá:

- Construir a imagem da aplicação a partir do `Dockerfile`.
- Iniciar o serviço PostgreSQL com as credenciais e banco de dados configurados.
- Inicializar o RabbitMQ.
- Iniciar a aplicação Node.js.

### 4. Acessar a Aplicação

Após o Docker Compose ter subido os containers, você poderá acessar a aplicação em:

- **Aplicação**: [http://localhost:3000](http://localhost:3000)
- **PostgreSQL**: Você pode acessar o banco de dados PostgreSQL na porta `5432` (caso queira conectar-se com algum cliente de banco de dados).


### 5. Parar os Containers

Para parar os containers, basta usar o comando:

```bash
docker-compose down
```

### 8. Logs

Para visualizar os logs dos containers em execução, use:

```bash
docker-compose logs -f
```

## Detalhes dos Containers

- **PostgreSQL**: Este container roda o banco de dados PostgreSQL e está configurado para ser acessado na porta `5432` do seu localhost.
- **RabbitMQ**: O RabbitMQ está rodando na porta `5672` (por padrão).
- **Aplicação Node.js**: A aplicação está rodando na porta `3000`.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, corrigir bugs ou adicionar funcionalidades ao projeto.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.