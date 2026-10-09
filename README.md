# Portf&#243;lio - Assis Pires Neto

Portf&#243;lio pessoal de Assis Pires Neto, desenvolvedor Full Stack / Back-end em Porto Alegre, RS. O site apresenta experi&#234;ncia, forma&#231;&#227;o e projetos p&#250;blicos carregados da API do GitHub.

## Tecnologias

- React 19, TypeScript e Create React App
- Sass, layout responsivo e temas claro/escuro
- GitHub REST API, `localStorage` e cache de uma hora
- Jest e React Testing Library
- GitHub Pages com `gh-pages`

## Rodar localmente

```bash
git clone https://github.com/Lancellot/react-portfolio.git
cd react-portfolio
npm install
npm start
```

Abra `http://localhost:3000`.

## GitHub API e vari&#225;veis de ambiente

O portfolio busca os reposit&#243;rios p&#250;blicos de [Lancellot](https://github.com/Lancellot), percorre todas as p&#225;ginas e ignora forks e reposit&#243;rios arquivados, al&#233;m do pr&#243;prio portfolio. Os dois reposit&#243;rios do Velo est&#227;o marcados como forks pelo GitHub e s&#227;o uma exce&#231;&#227;o expl&#237;cita na configura&#231;&#227;o para manter o projeto completo. Os dados ficam em cache no navegador por uma hora. Em falha da API ou rate limit, o site usa dados est&#225;ticos locais.

O token &#233; opcional. O Create React App carrega vari&#225;veis `REACT_APP_*`; crie um `.env.local` apenas se precisar aumentar o limite da API:

```env
REACT_APP_GITHUB_TOKEN=seu_token_de_leitura
```

O c&#243;digo tamb&#233;m aceita `VITE_GITHUB_TOKEN` quando essa vari&#225;vel for disponibilizada pelo ambiente. O deploy &#233; um site est&#225;tico: qualquer token usado no navegador fica vis&#237;vel no bundle. Prefira n&#227;o definir token; se definir, use um token sem permiss&#245;es de escrita e nunca o commite.

## Agrupar e destacar projetos

Edite [`src/projects.config.ts`](./src/projects.config.ts). Cada defini&#231;&#227;o lista nomes de reposit&#243;rios que pertencem ao mesmo produto, tecnologias e se o projeto deve ficar em destaque. Vou Ali agrupa `vou-ali-backend-nest` e `vou-ali-react-ts-tailwind`; Velo agrupa `ride-backend` e `ride-frontend`. A correspond&#234;ncia ignora mai&#250;sculas e pontua&#231;&#227;o e compara o nome completo normalizado. Assim, os reposit&#243;rios de API e interface aparecem em um card com a&#231;&#245;es separadas. Os forks do Velo t&#234;m uma permiss&#227;o individual na configura&#231;&#227;o; forks n&#227;o listados continuam ocultos. Adicione aqui os nomes exatos usados no GitHub para novos reposit&#243;rios.

Os projetos configurados ficam no topo; qualquer reposit&#243;rio tamb&#233;m pode ser destacado adicionando o topic `featured` no GitHub. Os filtros combinam linguagem principal e topics dos reposit&#243;rios com as tecnologias configuradas.

## Contatos e curr&#237;culo

E-mail, WhatsApp, LinkedIn e GitHub ficam em [`src/config.ts`](./src/config.ts). Coloque o PDF do curr&#237;culo em `public/curriculo.pdf`; o bot&#227;o do Hero aponta para esse caminho. O arquivo n&#227;o est&#225; inclu&#237;do neste reposit&#243;rio.

## Scripts e deploy

```bash
npm start       # desenvolvimento
npm test        # testes Jest (use -- --watchAll=false em CI)
npm run build   # build de producao
npm run deploy  # build e publicacao na branch gh-pages
```

O `homepage` no `package.json` est&#225; configurado como `https://lancellot.github.io/react-portfolio/`. O script `predeploy` executa o build antes de publicar. Execute o deploy somente a partir de `main`; o comando `gh-pages` atualiza a branch de publica&#231;&#227;o.
