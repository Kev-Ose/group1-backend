import express from 'express';

import authControllers from '../controllers/auth.js';

const router = express.Router();


// routes
router.post('/register', authControllers.register);
router.post('/login',authControllers.login);
router.post('/logout',authControllers.logout);

export default router;
