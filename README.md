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
