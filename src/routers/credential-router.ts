import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { credentialSchema } from '@/schemas';
import { authenticateToken } from '@/middlewares';
import { credentialPost, credentialGetAll, credentialGetById } from '@/controllers';


const credentialRouter = Router();
credentialRouter.all('/*', authenticateToken).
post('/', validateBody(credentialSchema), credentialPost)
.get('/', credentialGetAll)
.get('/:credentialId', credentialGetById); 
export { credentialRouter };