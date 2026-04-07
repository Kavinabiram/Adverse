# Tailwind v4 PostCSS Fix

The error "you're trying to use 'tailwindcss' directly as a PostCSS plugin" happens with **Tailwind CSS v4** when using the old `postcss.config.js` syntax.

### 🔧 Fixes applied:
1.  **Installed `@tailwindcss/postcss`** for compatibility.
2.  **Updated `postcss.config.js`** to use `@tailwindcss/postcss` instead of `tailwindcss`.
3.  **Modernized `src/styles/theme.css`** with the v4 `@import "tailwindcss";` and `@theme` syntax.
4.  **Removed legacy `tailwind.config.js`** to avoid version conflicts (v4 is CSS-first).
5.  **Cleaned up `src/index.css`** to prevent style overrides.

### 🚀 To Resume:
1.  **Stop all existing terminal processes.**
2.  In the `frontend` directory:
    ```bash
    npm install
    npm run dev
    ```
3.  In the `backend` directory:
    ```bash
    npm install
    npm start
    ```

The dashboard should now load on [http://localhost:5173/](http://localhost:5173/) (or 5174 if the old process is still hanging).
