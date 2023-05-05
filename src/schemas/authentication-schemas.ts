import Joi from 'joi';
import { CreateUserParams } from '@/services/users-service';


export const signInSchema = Joi.object<CreateUserParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
