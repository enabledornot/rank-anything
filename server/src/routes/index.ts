import { Router } from 'express';

const router = Router();

router.get('/', (_request, response) => {
  response.send('Welcome to Express');
});

export default router;
