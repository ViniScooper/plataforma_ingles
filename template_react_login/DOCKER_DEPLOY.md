# 🚀 Como Hospedar a Plataforma na Sua Máquina (Docker & Compartilhamento)

Sim, é totalmente possível rodar o servidor na sua máquina e compartilhar o link para que seus alunos acessem!

Aqui está o guia passo a passo de como "dokerizar" sua aplicação e torná-la acessível na internet.

---

## 🛠️ Passo 1: Preparando o Dockerfile

Você precisará criar dois arquivos na raiz do seu projeto (\`template_react_login\`): um \`Dockerfile\` (para construir a imagem da sua aplicação) e um \`docker-compose.yml\` (para subir banco de dados e aplicação juntos, se necessário).

### 1. Crie um arquivo chamado \`Dockerfile\` na raiz do projeto:

\`\`\`dockerfile
# Usar a imagem oficial do Node.js
FROM node:18-alpine

# Criar diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência do Front-end
COPY package*.json ./
RUN npm install

# Copiar os arquivos de dependência do Back-end (api_users)
COPY api_users/package*.json ./api_users/
RUN cd api_users && npm install

# Copiar todo o código do projeto
COPY . .

# Fazer a build do Front-end (React/Vite)
RUN npm run build

# Gerar o Prisma Client no Back-end
RUN cd api_users && npx prisma generate

# Expor as portas usadas (Front-end e API)
EXPOSE 5173
EXPOSE 3000

# Script para iniciar o backend e o frontend ao mesmo tempo
CMD ["sh", "-c", "cd api_users && npm run start & npm run preview -- --host"]
\`\`\`

---

## 🐳 Passo 2: Criando o Docker Compose (Opcional, mas recomendado)

Para facilitar a inicialização de tudo com um único comando, crie um arquivo chamado \`docker-compose.yml\` na raiz:

\`\`\`yaml
version: '3.8'
services:
  plataforma-ingles:
    build: .
    ports:
      - "5173:5173" # Porta do Front-end
      - "3000:3000" # Porta da API
    environment:
      - VITE_API_URL=http://SEU_IP_LOCAL:3000 # Altere pelo seu IP local depois
      - DATABASE_URL=postgres://qczjtdig... # (Use a do Supabase que já temos)
      - JWT_SECRET=sua_chave_secreta_super_segura
\`\`\`

---

## ▶️ Passo 3: Como Rodar Localmente

1. Certifique-se de ter o **Docker Desktop** instalado no seu Windows e rodando.
2. Abra o terminal na pasta raiz (\`plataforma_ingles/template_react_login\`).
3. Execute o comando:
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`
   *(Isso vai baixar as imagens e colocar seu site no ar no \`localhost:5173\`.)*

---

## 🌍 Passo 4: Como Compartilhar o Link com seus Alunos

Para que os alunos acessem o servidor rodando no seu computador (sem precisar colocar em uma hospedagem paga), você pode usar um serviço de túnel seguro chamado **Ngrok** ou **Cloudflare Tunnels**. Vamos pelo mais fácil (Ngrok):

### Usando Ngrok (Recomendado para testes)
1. Acesse [ngrok.com](https://ngrok.com/), crie uma conta gratuita e instale no seu PC.
2. Com o seu servidor rodando (no Docker ou via \`npm run dev\`), abra um novo terminal.
3. Se o frontend roda na porta **5173**, digite:
   \`\`\`bash
   ngrok http 5173
   \`\`\`
4. O Ngrok vai gerar um link público (ex: \`https://abcd-123-45.ngrok-free.app\`).
5. **ATENÇÃO:** Como o front-end chama o back-end, você também precisa expor o back-end se ele estiver em porta separada, OU configurar o VITE para chamar a URL correta. 

### A Alternativa Completa e Gratuita (Vercel + Render):
Se você quiser que o site fique **24 horas online sem depender do seu computador estar ligado**, a recomendação número 1 é:
1. Hospedar a pasta \`api_users\` (Back-end) no serviço **Render.com** (tem plano 100% gratuito).
2. Hospedar a raiz do projeto (Front-end) na **Vercel.com** (tem plano 100% gratuito).
3. O Supabase já está hospedando seu banco de dados (que já é na nuvem). 
Assim seus alunos terão um link profissional (\`suaplataforma.vercel.app\`) que nunca desinstala.

> 💡 **Nota do Desenvolvedor:** Se precisar que eu configure os arquivos para hospedar de graça na Vercel e Render ao invés do seu computador local, é só me pedir!
