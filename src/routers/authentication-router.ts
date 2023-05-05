import { Router } from 'express';
import { singInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter.post('/', validateBody(signInSchema), singInPost);

export { authenticationRouter };
