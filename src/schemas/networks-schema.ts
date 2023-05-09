import Joi from 'joi';
import { PostNetwork } from '@/protocols';
  
  export const networkSchema = Joi.object<PostNetwork>({
      network: Joi.string().required(),
      password: Joi.string().required(),
      title: Joi.string().required(),
    });
  