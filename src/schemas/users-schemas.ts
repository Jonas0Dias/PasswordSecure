import Joi from 'joi';
import { User } from '@prisma/client';


// export type CreateUserParams = Pick<User, 'email' | 'password'>;

export const createUserSchema = Joi.object<User>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
