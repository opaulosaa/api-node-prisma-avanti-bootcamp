# API Node + Prisma - Bootcamp Avanti

## Objetivo do Projeto

Esta API REST simula um **Banco de Trocas de Conhecimento**, onde usuários podem se cadastrar e publicar ofertas de conhecimento (mentorias, aulas, consultorias etc.). O projeto foi desenvolvido durante o Bootcamp Avanti - Dev Full Stack com foco em boas práticas de desenvolvimento back-end, segurança com autenticação JWT e persistência de dados com Prisma ORM.

Principais funcionalidades:

- Cadastro e gerenciamento de usuários (`Pessoa`)
- Autenticação segura via JWT com senhas criptografadas (bcrypt)
- CRUD completo de ofertas de conhecimento (`Conhecimento`)
- Proteção de rotas: apenas o dono da oferta pode editá-la ou excluí-la
- Validações de entrada (e-mail válido, senha mínima de 8 caracteres)

---

## Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js (CommonJS) | Ambiente de execução JavaScript no servidor |
| Express 5 | Framework para criação das rotas e middlewares |
| Prisma ORM | Mapeamento objeto-relacional e migrations |
| PostgreSQL | Banco de dados relacional |
| bcrypt | Hash seguro de senhas |
| jsonwebtoken (JWT) | Geração e validação de tokens de autenticação |
| dotenv | Gerenciamento de variáveis de ambiente |
| nodemon | Reinicialização automática do servidor em desenvolvimento |
| uuid | Geração de IDs únicos |

---

## Instruções para Executar a Aplicação

### Pré-requisitos

- Node.js 18+ e npm instalados
- Um banco PostgreSQL acessível (local ou remoto)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="uma_chave_qualquer_e_segura"
```

Substitua os valores de `DATABASE_URL` com as credenciais do seu banco PostgreSQL.

### 3. Sincronizar o banco de dados

```bash
npx prisma generate    # Atualiza o cliente do Prisma
npx prisma db push     # Aplica o schema no banco de dados
```

### 4. Iniciar o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## Rotas da API

Base URL: `http://localhost:3000`

### Usuários (`/users`)

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/users` | Lista todos os usuários (com ofertas) | Não |
| POST | `/users` | Cadastra um novo usuário | Não |
| GET | `/users/:id` | Retorna um usuário pelo ID | Não |
| PATCH | `/users/:id` | Atualiza dados de um usuário | Não |
| DELETE | `/users/:id` | Remove um usuário | Não |
| POST | `/users/login` | Realiza login e retorna token JWT | Não |

### Ofertas (`/ofertas`)

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/ofertas` | Lista ofertas (filtros: `search`, `categoria`, `nivel`) | Não |
| POST | `/ofertas` | Cria uma nova oferta | Sim |
| PUT | `/ofertas/:id` | Atualiza uma oferta | Sim (somente dono) |
| DELETE | `/ofertas/:id` | Remove uma oferta | Sim (somente dono) |

Rotas marcadas com **Sim** exigem o header: `Authorization: Bearer <TOKEN>`

---

## Guia de Teste da Segurança (Passo a Passo)

### Passo 1 — Sincronizar o Ambiente

Como o `schema.prisma` foi atualizado e novas bibliotecas foram adicionadas, rode os comandos abaixo no terminal:

```bash
npm install                # Instala bcrypt e jsonwebtoken
npx prisma generate        # Atualiza o cliente do Prisma
npx prisma db push         # Garante que o campo 'senha' existe no seu banco
```

### Passo 2 — Configurar o arquivo `.env`

O login precisa de uma chave secreta. Verifique se o seu arquivo `.env` contém a linha:

```env
JWT_SECRET="uma_chave_qualquer_e_segura"
```

> Depois de salvar o `.env`, reinicie o servidor.

### Passo 3 — Criar um NOVO Usuário (Obrigatório)

Nao use usuários antigos. Como agora usamos criptografia, usuários criados antes desta atualização possuem senhas em formato incompatível com o novo código.

No Insomnia, faça um **POST** em `/users` com uma senha de pelo menos 8 caracteres e copie o e-mail exato que você usar.

### Passo 4 — Realizar o Login

- **URL:** `POST /users/login`
- **Body:** use o e-mail e a senha criados no passo anterior

> Se der erro, verifique se não há espaços em branco antes ou depois do e-mail no JSON.

### Passo 5 — Usar o Token (O "Crachá")

Após o login, você receberá um token. Para criar, editar ou deletar uma oferta:

1. No Insomnia, vá na aba **Auth**
2. Escolha **Bearer Token**
3. Cole o token recebido no login

---

## Guia de Testes no Insomnia (Passo a Passo)

Siga esta ordem para testar se as travas de segurança estão funcionando corretamente.

### 1. Criar um Usuário (Cadastro)

**Método:** `POST`  
**URL:** `http://localhost:3000/users`  
**Body (JSON):**

```json
{
  "nome": "João Iniciante",
  "email": "joao@teste.com",
  "senha": "senha-segura-123",
  "telefone": "11999999999",
  "descricao": "Estudante de tecnologia"
}
```

**O que observar:** O servidor deve retornar `201 Created`. Copie o `"id"` da resposta — você precisará dele para criar ofertas.

---

### 2. Fazer Login

**Método:** `POST`  
**URL:** `http://localhost:3000/users/login`  
**Body (JSON):**

```json
{
  "email": "joao@teste.com",
  "senha": "senha-segura-123"
}
```

**O que observar:** O servidor deve retornar um token longo. Copie esse token inteiro (sem as aspas).

---

### 3. Criar uma Oferta (Testando a Segurança)

**Método:** `POST`  
**URL:** `http://localhost:3000/ofertas`

**Configuração de Autenticação:**
1. Abaixo da URL, clique na aba **Auth**
2. Escolha **Bearer Token**
3. Cole o token copiado no passo anterior

**Body (JSON):**

```json
{
  "titulo": "Monitoria de Lógica",
  "descricao": "Ajudo iniciantes com algoritmos",
  "categoria": "Educação",
  "nivel": "Básico",
  "pessoa_id": "COLE_AQUI_O_ID_DO_JOAO"
}
```

---

### 4. Testes de Erro (Verificando a "Blindagem")

Use os JSONs abaixo para confirmar que as validações estão funcionando:

**Senha curta (Cadastro):**

```json
{ "nome": "Teste", "email": "teste@teste.com", "senha": "123" }
```

Resultado esperado: `400 Bad Request` — "Senha deve ter pelo menos 8 caracteres"

---

**E-mail inválido (Cadastro):**

```json
{ "nome": "Teste", "email": "joao.com", "senha": "senha123" }
```

Resultado esperado: `400 Bad Request` — "E-mail não é válido"

---

**Sem Token (Criar Oferta):**

Tente fazer um `POST /ofertas` sem configurar a aba Auth.

Resultado esperado: `401 Unauthorized` — "Token não fornecido"

---

## Observações

- Senhas são armazenadas com hash `bcrypt` — nunca em texto puro.
- O campo `DATABASE_URL` deve apontar para um banco PostgreSQL válido.
- Erros de e-mail duplicado retornam código Prisma `P2002`.
- Arquivos principais: [index.js](index.js), [prisma/schema.prisma](prisma/schema.prisma), [src/middlewares/auth.js](src/middlewares/auth.js)
