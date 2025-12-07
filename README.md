# Café Aroma - Projeto de Exemplo

Este repositório contém um site de vitrine para o projeto "Café Aroma". O objetivo é demonstrar um layout profissional com recursos interativos: catálogo de produtos, modal/carrossel de imagens, avaliações com foto e sistema de toast para adicionar ao carrinho.

Funcionalidades implementadas:
- Grid de produtos com filtros
- Modal de produtos com carrossel, thumbs, navegação por teclado e autoplay
- Modal de avaliações com fotos dos usuários e 1–5 estrelas + labels (Ruim..Excelente)
- Adicionar ao carrinho com notificação (toast)
- Acessibilidade básica: roles ARIA, foco em modais, keyboard navigation
- Responsivo e otimizado para mobile

Como rodar localmente:
1. Instale o Python 3. Se você tiver outras opções, um servidor simples funciona.
2. Abra um terminal na pasta do projeto e rode:

```powershell
python -m http.server 8000
```

3. Abra http://localhost:8000 no seu navegador.

Melhorias recomendadas:
- Integrar com backend/API para carregar produtos e avaliações dinamicamente

Como testar o envio de contato (Gmail API / OAuth2):
1. Preencha as variáveis no `.env` (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN/EMAIL_PASS, EMAIL_USER)
2. Instale dependências:
```powershell
npm install
```
3. Se você ainda não tem `REFRESH_TOKEN`, gere-o com:
```powershell
npm run token
```
Isso abrirá uma URL para autorizar o app no Google e retornará o `code` (ou use o callback `/oauth2callback`). Cole o `refresh_token` no `.env`.
4. Inicie o servidor:
```powershell
npm run start
```
5. Abra o site no navegador: http://localhost:3000
6. Na seção Contato, preencha e envie a mensagem — o servidor enviará o e-mail usando as credenciais configuradas.
- Testes de acessibilidade adicionais (axe, Lighthouse)
- Aprimoramentos de performance (compressão de imagens, service worker)

Feito com cuidado para um visual moderno e acessível. Se desejar, posso:
- adicionar analytics e SEO
- integrar checkout fictício
- gerar um build automatizado

