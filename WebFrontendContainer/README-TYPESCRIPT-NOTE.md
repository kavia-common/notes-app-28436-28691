# TypeScript in CRA JS Template

This project includes some `.tsx` and `.ts` files for type-safety. If your local environment fails to compile due to missing TypeScript dependencies, install them:

npm install --save typescript @types/react @types/react-dom @types/react-router-dom

Create React App supports mixed JS/TS. You can keep using JS files without converting everything to TypeScript.

Build tip: The preview auth flow returns `{ access_token, expires_in }`. Avoid referencing `data.token` in TypeScript; use `data.access_token` instead (already applied).
