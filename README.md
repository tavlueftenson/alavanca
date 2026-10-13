# Manovella · ferramentaria digital

Site da Manovella, publicado pelo GitHub Pages em https://tavlueftenson.github.io/manovella/

## Arquivos

- `index.html`: todo o conteúdo do site
- `estilo.css`: cores, tipografia e diagramação
- `site.js`: menu do celular, filtro de exemplos, formulário e contatos
- `imagens/`: ícone do site e imagem usada quando o link é compartilhado

## Como preencher os contatos

Abra `site.js` e preencha o bloco `CONTATO` no começo do arquivo:

```js
const CONTATO = {
  whatsapp: "5554999998888",
  email: "contato@manovella.com.br"
};
```

O número vai só com dígitos: 55, o DDD e o número. Depois disso, todos os botões de WhatsApp do site passam a abrir a conversa, e o formulário de contato envia a mensagem pronta pelo WhatsApp.

## Domínio próprio

Quando houver um domínio, configure em Settings › Pages › Custom domain e troque o endereço nas linhas `og:url` e `og:image` do `index.html`.
