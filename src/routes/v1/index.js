import { Router } from 'express';
import config from '../../config/config.js';
import docsRoute from './docs.route.js'; // Import the default export from docs.route.js
import trelloRoute from './trello.route.js';

const router = Router();

const defaultRoutes = [
  { path: '/trello', route: trelloRoute }
];

const devRoutes = [
  // Routes available only in development mode
  {
    path: '/docs',
    route: docsRoute, // Use the imported docsRoute here
  },
];

// Add default routes
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Add dev routes if in development environment
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
