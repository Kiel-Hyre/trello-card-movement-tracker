import { Router } from 'express';
import config from '../../config/config.js';
import docsRoute from './docs.route.js'; // Import the default export from docs.route.js

const router = Router();

const defaultRoutes = [
  // Add default routes here
  // Example:
  // { path: '/auth', route: authRoute },
  // { path: '/users', route: userRoute },
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
