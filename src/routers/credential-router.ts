import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { credentialSchema } from '@/schemas';
import { authenticateToken } from '@/middlewares';
import { credentialPost } from '@/controllers';


const credentialRouter = Router();
credentialRouter.all('/*', authenticateToken).
post('/', validateBody(credentialSchema), credentialPost);

export { credentialRouter };