# Modern Angular Store: do zero ao avançado

<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/27d56bfc-ab08-4cf7-96e8-426572ece77d" />

Este repositório contém o projeto criado no **Curso de Modern Angular**.

## 🧠 O que “Modern Angular” significa neste projeto

Este projeto segue as **boas práticas modernas do Angular**, incluindo:

- ✅ Standalone components (sem `NgModule`)
- ✅ Defaults modernos do Angular CLI
- ✅ Mentalidade signals-first
- ✅ Built-in control flow (`@if`, `@for`, `@switch`)
- ✅ Setup moderno de testes
- ✅ Estrutura de projeto limpa e explícita

## 🧭 Progressão do curso

<details>
<summary>1: Building blocks do Angular</summary>

- 01: [Primeiros passos](https://youtu.be/cMi3mNWjtyY)
- 02: [Configuração do ambiente](https://youtu.be/GxTBDSiKNeY)
- 03: [Criando o primeiro component](https://youtu.be/oJJNTyFcsN4)
- 04: [Templates e interações de component](https://youtu.be/E9Q1yn3h9d0)
- 05: [Introdução aos signals](https://youtu.be/j1diBkWLk1k)
- 06: [Computed signals](https://youtu.be/KTSkMvRT6zs)
- 07: [Effects](https://youtu.be/jjGT7EwdH9o)

</details>

## 🗺️ Roadmap

As tarefas estão ordenadas por esforço. Cada uma deve ser pequena o suficiente para caber em um único commit.

### Fase 1 — Polimento (ganhos rápidos)

- [ ] Formatar preços com `CurrencyPipe` (`{{ product().price | currency }}`) em vez de números crus
- [ ] Remover código morto: o demo comentado de `@for` em `products-grid.html`, os métodos
      comentados `clearSearch`/`trimSearch` e o teste comentado em `app.spec.ts`
- [ ] Remover os estilos órfãos `.demo-item` / `.search-preview` de `products-grid.scss`
- [ ] Remover o signal `title` não utilizado de `App`, ou de fato renderizá-lo
- [ ] Decidir sobre o routing: ou dar rotas reais a `app.routes.ts` ou remover o `<router-outlet />`
- [ ] Corrigir a acessibilidade dos ícones no header (`aria-hidden="false"` é redundante; adicionar
      `aria-label` aos próprios buttons)
- [ ] Exibir a contagem de resultados ao lado do campo de busca ("3 de 5 produtos")
- [ ] Adicionar um botão de limpar (`✕`) ao campo de busca

### Fase 2 — Um carrinho que realmente funciona

- [ ] Expor `items`, `totalPrice` e `isEmpty` como computed signals no `CartService`
- [ ] Adicionar `removeFromCart`, `updateQuantity` e `clearCart`
- [ ] Construir um `CartSheet` / `CartDialog` aberto pelo botão de carrinho do header
- [ ] Exibir uma confirmação com `MatSnackBar` quando um produto for adicionado
- [ ] Persistir o carrinho no `localStorage` com um `effect()`

### Fase 3 — Camada de dados

- [ ] Mover a lista de produtos hardcoded de `ProductsGrid` para um `ProductService`
- [ ] Carregar os produtos via `httpResource()` (ou `resource()`) com estados de loading e error
- [ ] Adicionar skeleton loaders enquanto os produtos são carregados
- [ ] Aplicar debounce no termo de busca para que a filtragem não rode a cada tecla digitada

### Fase 4 — Rotas e detalhe do produto

- [ ] Criar as rotas `/products` e `/products/:id` com `loadComponent` lazy
- [ ] Construir uma página de detalhe do produto lendo o `:id` via `withComponentInputBinding()`
- [ ] Adicionar uma rota `/cart`
- [ ] Adicionar uma rota 404 / not-found

### Fase 5 — Model de produto e filtros

- [ ] Estender `Product` com `imageUrl`, `category`, `rating` e `stock`
- [ ] Renderizar as imagens dos produtos no `ProductCard` com `NgOptimizedImage`
- [ ] Adicionar filtro por categoria e ordenação por preço (mais barato / mais caro)
- [ ] Desabilitar o "Add to Cart" para produtos sem estoque

### Fase 6 — Qualidade

- [ ] Definir `ChangeDetectionStrategy.OnPush` em todos os components
- [ ] Substituir os testes placeholder "should create" por testes de comportamento (busca, totais do carrinho)
- [ ] Adicionar ESLint (`ng add @angular/eslint`) e integrá-lo aos scripts do npm
- [ ] Adicionar um toggle de tema escuro (`color-scheme: light dark` + um switch no header)
- [ ] Adicionar um workflow do GitHub Actions rodando `format:check`, lint, test e build

## 🛠️ Pré-requisitos

Antes de rodar este projeto, certifique-se de ter:

- **Node.js (LTS)**  
  👉 Instalação recomendada:
  - macOS / Linux: **nvm**
  - Windows: **Chocolatey** ou **nvm-windows**

- **Angular CLI**
  ```bash
  npm install -g @angular/cli
  ```

## Servidor de desenvolvimento

Para iniciar um servidor de desenvolvimento local, execute:

```bash
ng serve
```

Com o servidor rodando, abra o navegador e acesse `http://localhost:4200/`. A aplicação será recarregada automaticamente sempre que você modificar qualquer arquivo de código-fonte.

## Build

Para fazer o build do projeto, execute:

```bash
ng build
```

Isso vai compilar o projeto e armazenar os build artifacts no diretório `dist/`. Por padrão, o build de produção otimiza a aplicação para performance e velocidade.

## Executando testes unitários

Para executar os testes unitários com o test runner [Vitest](https://vitest.dev/), use o seguinte comando:

```bash
ng test
```

O Angular CLI não vem com um framework de testes end-to-end por padrão. Você pode escolher o que melhor atende às suas necessidades.

## Recursos adicionais

Para mais informações sobre o uso do Angular CLI, incluindo referências detalhadas de comandos, visite a página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
