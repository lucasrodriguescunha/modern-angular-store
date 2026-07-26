# Modern Angular: From Zero to Advanced

<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/27d56bfc-ab08-4cf7-96e8-426572ece77d" />

This repository contains the project created in the **Modern Angular Course**.

## 🧠 What “Modern Angular” Means in This Project

This project follows **modern Angular best practices**, including:

- ✅ Standalone components (no `NgModule`)
- ✅ Modern Angular CLI defaults
- ✅ Signals-first mental model
- ✅ Built-in control flow (`@if`, `@for`, `@switch`)
- ✅ Modern testing setup
- ✅ Clean, explicit project structure

## 🧭 Course Progression

<details>
<summary>1: Angular Building Blocks</summary>

- 01: [Getting Started](https://youtu.be/cMi3mNWjtyY)
- 02: [Environment Setup](https://youtu.be/GxTBDSiKNeY)
- 03: [Creating the First Component](https://youtu.be/oJJNTyFcsN4)
- 04: [Component Templates and Interactions](https://youtu.be/E9Q1yn3h9d0)
- 05: [Introducing Signals](https://youtu.be/j1diBkWLk1k)
- 06: [Computed Signals](https://youtu.be/KTSkMvRT6zs)
- 07: [Effects](https://youtu.be/jjGT7EwdH9o)

</details>

## 🗺️ Roadmap

Tasks are ordered by effort. Each one is meant to be small enough to land in a single commit.

### Phase 1 — Polish (quick wins)

- [ ] Format prices with `CurrencyPipe` (`{{ product().price | currency }}`) instead of raw numbers
- [ ] Remove dead code: commented `@for` demo in `products-grid.html`, the commented
      `clearSearch`/`trimSearch` methods, and the commented test in `app.spec.ts`
- [ ] Drop the orphan `.demo-item` / `.search-preview` styles from `products-grid.scss`
- [ ] Remove the unused `title` signal from `App`, or actually render it
- [ ] Decide on routing: either give `app.routes.ts` real routes or remove `<router-outlet />`
- [ ] Fix icon accessibility in the header (`aria-hidden="false"` is redundant; add `aria-label`
      to the buttons themselves)
- [ ] Show a result count next to the search field ("3 of 5 products")
- [ ] Add a clear (`✕`) button to the search field

### Phase 2 — Cart that actually works

- [ ] Expose `items`, `totalPrice` and `isEmpty` as computed signals on `CartService`
- [ ] Add `removeFromCart`, `updateQuantity` and `clearCart`
- [ ] Build a `CartSheet` / `CartDialog` opened from the header cart button
- [ ] Show a `MatSnackBar` confirmation when a product is added
- [ ] Persist the cart to `localStorage` with an `effect()`

### Phase 3 — Data layer

- [ ] Move the hardcoded product list out of `ProductsGrid` into a `ProductService`
- [ ] Load products through `httpResource()` (or `resource()`) with loading and error states
- [ ] Add skeleton loaders while products are being fetched
- [ ] Debounce the search term so filtering does not run on every keystroke

### Phase 4 — Routes and product detail

- [ ] Create `/products` and `/products/:id` routes with lazy `loadComponent`
- [ ] Build a product detail page reading `:id` via `withComponentInputBinding()`
- [ ] Add a `/cart` route
- [ ] Add a 404 / not-found route

### Phase 5 — Product model and filters

- [ ] Extend `Product` with `imageUrl`, `category`, `rating` and `stock`
- [ ] Render product images in `ProductCard` with `NgOptimizedImage`
- [ ] Add category filtering and price sorting (cheapest / most expensive)
- [ ] Disable "Add to Cart" for out-of-stock products

### Phase 6 — Quality

- [ ] Set `ChangeDetectionStrategy.OnPush` on every component
- [ ] Replace the "should create" placeholder tests with behavior tests (search, cart totals)
- [ ] Add ESLint (`ng add @angular/eslint`) and wire it into the npm scripts
- [ ] Add a dark theme toggle (`color-scheme: light dark` + a switch in the header)
- [ ] Add a GitHub Actions workflow running `format:check`, lint, test and build

## 🛠️ Prerequisites

Before running this project, make sure you have:

- **Node.js (LTS)**  
  👉 Recommended installation:
  - macOS / Linux: **nvm**
  - Windows: **Chocolatey** or **nvm-windows**

- **Angular CLI**
  ```bash
  npm install -g @angular/cli
  ```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
