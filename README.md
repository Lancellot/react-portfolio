# Portfólio — Assis Pires Neto

Portfólio pessoal de **Assis Pires Neto**, desenvolvedor Full Stack com foco em Java/Spring Boot, TypeScript, Node.js, NestJS, React e Next.js.

O site carrega automaticamente os repositórios públicos de [lancellot](https://github.com/lancellot), ignora forks e arquivados por padrão, oferece busca/filtro e mantém um cache local para reduzir chamadas à API.

## Tecnologias

- React 19 + TypeScript
- Sass e CSS responsivo mobile-first
- GitHub REST API com cache em `localStorage`
- Create React App e GitHub Pages
- Jest + React Testing Library

## Desenvolvimento local

```bash
git clone https://github.com/lancellot/react-portfolio.git
cd react-portfolio
npm install
npm start
```

Abra `http://localhost:3000`.

## Variáveis de ambiente

O token é opcional. Ele aumenta o limite da API do GitHub e nunca deve ser commitado:

```bash
# .env.local
REACT_APP_GITHUB_TOKEN=seu_token_pessoal
```

Também é aceito `VITE_GITHUB_TOKEN` para compatibilidade com ambientes Vite. O token é usado no cliente, portanto não deve ter permissões de escrita: crie um token somente leitura e considere que qualquer segredo exposto em uma aplicação frontend pode ser inspecionado no navegador.

Sem token, o site continua funcionando com a API pública. Se a API falhar, o cache disponível é mantido e a interface apresenta uma mensagem de aviso.

## Personalizar projetos em destaque

Edite [`src/config.ts`](./src/config.ts) e altere:

```ts
featured: ['velo', 'personal-blog'],
includeForks: false,
includeArchived: false,
```

Os nomes em `featured` são comparados com o nome do repositório e aparecem primeiro. A integração também preserva os `topics` do GitHub, incluindo o topic `featured` caso você queira usá-lo na sua organização.

## Personalização de contato

Os links de e-mail, WhatsApp, LinkedIn, GitHub e currículo ficam no objeto `contact` em [`src/config.ts`](./src/config.ts). Adicione seu arquivo `curriculo.pdf` em `public/` para ativar o download do currículo.

## Scripts

```bash
npm start       # desenvolvimento
npm test        # testes
npm run build   # build de produção
npm run deploy  # build e publicação no GitHub Pages
```

## Deploy

O projeto usa GitHub Pages. Confira o campo `homepage` no `package.json` e execute `npm run deploy`.
