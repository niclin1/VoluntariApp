# Autenticação com JWT

Sistema completo de autenticação com JWT (JSON Web Token) para a API.

## 📁 Arquivos

- **infra/jwt.js** - Funções para gerar e verificar tokens JWT
- **infra/password.js** - Funções para hash e verificação de senhas
- **infra/db.js** - Cliente de banco de dados
- **infra/middleware.js** - Middlewares de autenticação (`withAuth`, `withRole`)
- **pages/api/v1/auth/register/index.js** - Endpoint de registro
- **pages/api/v1/auth/login/index.js** - Endpoint de login

## 🚀 Uso

### Registro

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "city": "São Paulo",
  "state": "SP",
  "interestArea": "Educação",
  "availability": "Tempo integral",
  "modality": "Presencial"
}
```

**Resposta (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "role": "volunteer"
  }
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "role": "volunteer"
  }
}
```

## 🔐 Protegendo Rotas

Use o middleware `withAuth` para proteger suas rotas:

```javascript
import { withAuth } from '@/infra/middleware';

async function handler(req, res) {
  // req.user contém os dados do token
  const userId = req.user.id;
  // seu código aqui
}

export default withAuth(handler);
```

### Verificar Role

Use `withRole` para restringir por papel:

```javascript
import { withRole } from '@/infra/middleware';

async function handler(req, res) {
  // apenas usuários com role 'admin' podem acessar
}

export default withRole('admin')(handler);
```

## 🔑 Variáveis de Ambiente

```env
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
JWT_EXPIRATION=7d
```

## 📊 Schema da Tabela `usuarios`

Colunas adicionadas pela migração:
- `password` (varchar(255)) - Senha com hash bcrypt
- `role` (varchar(64)) - Papel do usuário (padrão: 'volunteer')

## ✨ Segurança

- ✅ Senhas são hasheadas com bcrypt (10 rounds)
- ✅ JWTs assinados com chave secreta
- ✅ Validação de email único
- ✅ Expiração de token configurável
- ✅ Proteção de rotas com middleware
