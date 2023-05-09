import { ApplicationError } from '@/protocols';

export function titleAlreadyExist(): ApplicationError {
  return {
    name: 'titleAlreadyExist',
    message: 'This title is already using',
  };
}

