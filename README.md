# Grimório

Gerenciador de magias criado com Vue 3 + Vite.

## Requisitos

- Node.js >= 24.12.0

## Como rodar localmente

Instale dependências e inicie o servidor de desenvolvimento:

```sh
npm install
npm run dev
```

Abra http://localhost:5173/

## Build de produção

```sh
npm run build
```

## Deploy (GitHub Pages)

O projeto já está configurado para deploy automático via GitHub Actions: cada push para a branch `main` dispara o workflow que builda e publica a pasta `dist` na branch `gh-pages`.

Se preferir fazer deploy manualmente localmente, rode:

```sh
npm run build
npm run deploy
```

Site hospedado em: https://lucasnneto.github.io/grimorio/

## Lint

```sh
npm run lint
```

## Observações

- `favicon.svg` foi adicionado em `public/` e o título da página foi atualizado.
- Para forçar um deploy de teste, faça um commit e dê push para `main`.

