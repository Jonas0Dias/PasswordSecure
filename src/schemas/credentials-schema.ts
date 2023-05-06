import Joi from 'joi';
import { PostCredential } from '@/protocols';

export const credentialSchema = Joi.object<PostCredential>({
    url: Joi.string().uri().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    title: Joi.string().required(),
  });


