# RandomFoods - Sistema de Sugestão de Receitas Culinárias
## Membros
  - André Vitor Kuduavski GRR20184595
  - Carlos Felipe Godinho Silva GRR20184630
  - Gleidison Novais dos Santos GRR20186250
  - Guilherme Vinicius Valério GRR20184636
  - Rafael Henrique Karam GRR20184601

# Instruções de uso
## SERVIDOR
### Configuração de servidor
  - Criar um arquivo chamado `.env` dentro da pasta server.
  - Incluir a variável `PRD_DB` com os nome do banco de produção.
  - Incluir a variável `HML_DB` com os nome do banco de homologação.
  - Incluir a variável `DEV_DB` com os nome do banco de desenvolvimento.
  - Incluir a variável `PORT` com o número da porta a se usar (Padrão é 3333).
  - Incluir a variável `JWT_SECRET` com um text para assinatura do token do JWT.
  - Incluir a variável `JWT_ADMIN_SECRET` com um text para assinatura do token do JWT para ADMINS.
### Inciar Servidor
  - `npm run dev` ou `yarn dev` (Inicia em modo de desenvolvimento).
  - `npm run prod` ou `yarn prod` (Inicia em modo de produção).

## MOBILE
### Iniciar versão Mobile
  - `npm start` ou `yarn start` (Inicia aplicação mobile).