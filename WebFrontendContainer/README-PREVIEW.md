# Preview Notes

- Dev server binds to 0.0.0.0 and port 3000 to work with the preview system.
- TypeScript support is included; if the environment fails to install types, run:
  npm install --save-dev typescript @types/react @types/react-dom @types/react-router-dom
- Configure env:
  cp .env.example .env
  Then edit REACT_APP_API_BASE_URL as needed.

No postinstall or husky hooks are used to avoid hanging prebuild steps.
