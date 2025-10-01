# SAPII Store

A small React-based demo e-commerce frontend that fetches product data from DummyJSON and includes search, filtering, sorting, pagination, product details modal, and a simple in-memory cart.

This README explains how to run the project locally, where key files live, and a few troubleshooting notes.

## Tech stack

- React (create-react-app / react-scripts)
- Plain CSS for styling (see `src/App.css`)
- Fetch API for demo data (https://dummyjson.com)

## Quick start

1. Install dependencies (only needed once):

```powershell
cd 'C:\YourDirectory\APPS-DEV E-commerce'
npm install
```

2. Start the development server:

```powershell
npm start
```

3. Build for production:

```powershell
npm run build
```

4. Run tests:

```powershell
npm test
```

## Key files

- `src/App.js` — Main application component (UI logic: fetch, search, filters, pagination, cart, modal).
- `src/App.css` — Styling and layout for the app (variables, product grid, modal, cart).
- `public/index.html` — App template (fonts and title are configured here).
- `package.json` — Scripts and dependencies.
