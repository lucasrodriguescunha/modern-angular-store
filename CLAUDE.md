# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm start                 # ng serve em http://localhost:4200
npm run build             # build de produção em dist/ (configuração padrão: production)
npm test                  # Vitest via @angular/build:unit-test (jsdom, sem browser)
npm run format            # prettier --write .
npm run format:check      # usado antes de commitar
```

`ng test` entra em watch quando há TTY. Para uma rodada única e determinística (agentes/CI):

```bash
npx ng test --watch=false
npx ng test --watch=false --filter "^CartService"                              # por nome de suite/teste (regex)
npx ng test --watch=false --include src/app/services/cart/cart-service.spec.ts # por arquivo
npx ng test --watch=false --coverage
```

Não há ESLint no projeto (é uma tarefa da Fase 6 do roadmap); a única checagem estática é o
compilador do Angular (`strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature`).

## Arquitetura

Aplicação Angular 21 standalone — não existe `NgModule` em lugar nenhum. `main.ts` chama
`bootstrapApplication(App, appConfig)`.

**Providers (`src/app/app.config.ts`)** definem duas decisões que valem para todo o app:

- `LOCALE_ID: 'pt-BR'` + `DEFAULT_CURRENCY_CODE: 'BRL'` com `registerLocaleData(localePt)` — por isso
  `{{ price | currency }}` sem argumentos já formata em reais.
- `provideRouter(routes)` com `routes = []`. É andaime deliberado: o `<router-outlet />` foi removido
  do template e as rotas reais chegam na Fase 4. `App` renderiza `Header` + `ProductsGrid` direto.

**Fluxo de dados — o catálogo é remoto, o carrinho é local.**

`ProductService` (`src/app/services/product/product-service.ts`) carrega o catálogo com
`httpResource<Product[]>(() => '/products.json')`. O arquivo vive em `public/` e é servido como asset
estático, então não existe backend. O serviço expõe `products` / `isLoading` / `error` / `reload()`.
Detalhe que já causou bug: `resource.value()` **lança** quando o resource está em erro, mesmo com
`defaultValue` — por isso `products` é um `computed` guardado por `hasValue()`. Mantenha esse guard.

`ProductsGrid` consome esses três signals e deriva `filteredProducts` por `computed` sobre
`searchTerm`. Toda a lógica de estado (loading / erro / vazio / filtrado) está no template com
control flow embutido (`@if` / `@else if` / `@for` / `@empty`).

`CartService` (`providedIn: 'root'`, portanto singleton compartilhado entre `Header`, `ProductsGrid` e
`CartDialog`) guarda um único `signal<CartItem[]>` privado e expõe leitura por `asReadonly()` +
`computed` (`totalItems`, `totalPrice`, `isEmpty`). A persistência é um `effect()` que escreve em
`localStorage`; a leitura inicial valida cada item com um type guard e descarta lixo silenciosamente,
e a escrita engole exceções (quota/modo privado) para não derrubar o app.

## Convenções do código

- **Nomes de arquivo sem sufixo de tipo**: `product-card.ts` exporta `ProductCard`,
  `cart-service.ts` exporta `CartService`. Siga isso ao criar arquivos novos (é o default do CLI
  moderno, não uma exceção).
- **Signals-first**: `input.required<T>()` / `input()` / `output()` em vez de `@Input`/`@Output`;
  `inject()` em vez de parâmetros de construtor; estado em `signal`, derivações em `computed`,
  `effect` só para side effects (hoje: persistência do carrinho).
- **`protected readonly` para membros usados só no template**, `private readonly` para dependências
  internas. `public` apenas quando algo é consumido de fora da classe.
- Componentes com `templateUrl` + `styleUrl` (SCSS) — nada de template inline.
- Angular Material com tema M3 aplicado por `mat.theme()` em `src/styles.scss`. Use as variáveis de
  sistema (`--mat-sys-surface`, `--mat-sys-on-surface`, …) em vez de cores hardcoded.
- Prettier: `printWidth: 100`, aspas simples, parser `angular` para HTML. Rode `npm run format`
  depois de editar.
- **Idiomas**: textos de UI e mensagens de commit em inglês; README e comentários de código em
  pt-BR. Comente só o não óbvio (por que o guard existe, por que o teste precisa de um `tick`).

## Convenções de teste

Runner é o Vitest sob o builder `@angular/build:unit-test`, rodando em jsdom.
`src/test-setup.ts` limpa o `localStorage` antes de cada teste — testes de carrinho contam com isso.

Testes são de comportamento, não de fumaça: eles consultam o DOM renderizado (`mat-card-title`,
`mat-hint`, `.status-state`) em vez de inspecionar campos da classe. Ao mexer em template, espere
quebrar testes que dependem desses seletores.

Ao testar código com `resource`/`httpResource`:

- a requisição só sai depois de um `TestBed.tick()` (serviço) ou `fixture.detectChanges()`
  (componente) — o resource dispara a partir de um effect;
- enquanto o resource carrega ele mantém um `PendingTask` aberto, então `whenStable()` só resolve
  _depois_ de responder à requisição. Para asserções sobre o estado de loading use detecção de
  mudanças síncrona e só então dê `flush`;
- desligue animações do Material nos testes de componente com
  `{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }`.

## Fluxo de trabalho

O README contém o roadmap do projeto em fases (1 a 6) com checkboxes. Cada fase vira uma branch
`tipo/phase-N-tema` (ex.: `feat/phase-3-data-layer`) com PR própria contra `master`; nunca commite em
uma branch já mergeada. Cada tarefa do roadmap deve caber em um commit pequeno, e marcar o checkbox
no README é um commit `docs(readme): ...` separado do commit de implementação.

Mensagens de commit seguem Conventional Commits com escopo e descrição em inglês minúsculo:
`feat(products): load the catalog over http with httpResource`,
`test(cart-service): cover the localStorage persistence`.
