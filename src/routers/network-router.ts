import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { networkSchema } from '@/schemas';
import { authenticateToken } from '@/middlewares';
import { networkPost, networkGetAll, networkGetById, deleteNetworkById } from '@/controllers';


const networkRouter = Router();
networkRouter.all('/*', authenticateToken).
post('/', validateBody(networkSchema), networkPost)
.get('/', networkGetAll)
.get('/:networkId', networkGetById)
.delete('//:networkId', deleteNetworkById); 
export { networkRouter };