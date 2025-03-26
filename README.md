# Meu Portfólio

Bem-vindo ao meu portfólio! Este é um projeto desenvolvido com **React**, **HTML**, **CSS** e **JavaScript** para exibir meus projetos e habilidades de forma moderna e responsiva.
![Static Badge](https://img.shields.io/badge/Status-40%25_Desenvolvido-yellow)
## 🚀 Visualização

Você pode acessar o portfólio online aqui:  
👉 [https://lacellot.github.io/react-portfolio](https://lancellot.github.io/react-portfolio/)

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção da interface do usuário.
- **HTML**: Estruturação do conteúdo.
- **CSS**: Estilização e design moderno.
- **JavaScript**: Funcionalidades interativas.
- **GitHub Pages**: Hospedagem do site.

## 📁 Estrutura do Projeto
````
meu-portfolio/
├── public/ # Arquivos estáticos (HTML, imagens, etc.)               
├── src/ # Código-fonte do projeto                         
│ ├── components/ # Componentes React                   
│ ├── App.js # Componente principal                   
│ ├── App.scss # Estilos globais                  
│ ├── index.js # Ponto de entrada do React               
│ └── img/ # Imagens do projeto            
├── package.json # Dependências e scripts do projeto                  
├── README.md # Este arquivo                    
└── ... # Outros arquivos de configuração                             
````


## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/meu-portfolio.git
   ```

    Instale as dependências:
    ```bash
    

    cd meu-portfolio
    npm install
    ```

    Inicie o servidor de desenvolvimento:
    ```bash
   
    npm start
    ```
    Acesse o projeto:
    Abra o navegador e acesse:
    http://localhost:3000

🚀 Como Fazer o Deploy no GitHub Pages

Para publicar o projeto no GitHub Pages, siga os passos abaixo:
    Instale o pacote gh-pages:  
   ```bash
    npm install gh-pages --save-dev
   ```
 Adicione as configurações no package.json:
 Adicione as seguintes linhas:
    
   ```json
   "homepage": "https://seu-usuario.github.io/meu-portfolio",
   "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d build"
    }
   ```
   Execute o deploy:
   ```bash
    npm run deploy
   ```
   Ative o GitHub Pages:

   Vá para o repositório no GitHub.

   Clique em Settings > Pages.

   Em Source, selecione o branch gh-pages e a pasta / (root).

   Clique em Save.

   Acesse seu site:
   Seu site estará disponível em:
   https://lancellot.github.io/react-portfolio/


📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Feito por Assis
Copy

