import express, { Router } from 'express';
import { register, login } from '../controllers/auth';

const router: Router = express.Router();

//to register an user
router.post('/register', register);

//to login an user
router.post('/login', login);

export = router;