The web dev server is configured to run on 0.0.0.0:3002.

How it works:
- .env and .env.example set PORT=3002 and HOST=0.0.0.0 for Create React App (react-scripts).
- If this project uses Vite, vite.config.[js|ts] is included to enforce server.port=3002 and host=true.
- In container runtime, the same environment variables ensure binding to 0.0.0.0:3002.

No changes are required to npm scripts; react-scripts and Vite honor these settings.
