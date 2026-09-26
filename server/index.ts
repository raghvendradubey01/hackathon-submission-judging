import { createServer } from './app.js';
import { createServer as createViteServer } from 'vite';
import http from 'http';

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = createServer();
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware directly into Express
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const express = (await import('express')).default;
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Dogfood Platform] Running hermetically at http://0.0.0.0:${PORT}`);
    console.log(`[Dogfood Platform] Node Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[Dogfood Platform] REST API active at /api/*`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting Dogfood Platform server:', err);
  process.exit(1);
});
