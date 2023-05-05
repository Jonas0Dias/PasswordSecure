import { ApplicationError } from '@/protocols';

export function invalidCredentialsError(): ApplicationError {
  return {
    name: 'InvalidCredentialsError',
    message: 'email or password are incorrect',
  };
}

export function tokenAlreadyExist(token: string): ApplicationError {
  return {
    name: 'tokenAlreadyExist',
    message: `The token Already exists and it is ${token}`,
  };
}

