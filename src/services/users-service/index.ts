import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { duplicatedEmailError } from './errors';
import userRepository from '@/repositories/user-repository';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {

  await validateUniqueEmailOrFail(email); // verificando se ja tem cadastro com ese email

  const hashedPassword = await bcrypt.hash(password, 12); // criptografando a senha
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError(); // se ja existir algum cadastro com esse email eu lanço um erro. Isso vai fazer o meu controller captar um catch que recebe o nome do erro, neste caso o DuplicatedEmail e vai passar pra proxima função do router, que é o handleApplication Error, la ele identifica qual o erro foi lançado e retorna o http status correspondente.
  }
}



export type CreateUserParams = Pick<User, 'email' | 'password'>;

const userService = {
  createUser,
};

export * from './errors';
export default userService;
