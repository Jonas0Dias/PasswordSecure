import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PostCredentialWithUserId, CredentialWithoutId } from '@/protocols';
import { titleAlreadyExist } from './errors';
import credentialRepository from '@/repositories/credential-repository';
import { Credential } from '@prisma/client';

export async function createCredential(data: PostCredentialWithUserId) : Promise<Credential> {

  await validateUniqueTitle(data.title);

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const dados = {
    url: data.url,
    title: data.title,
    password: hashedPassword,
    userId: data.userId,
    username: data.username
  } 
  

  return credentialRepository.create(
    dados
  );
}

async function validateUniqueTitle(title: string) {
  const alreadyExistTitle = await credentialRepository.findByTitle(title);
  if (alreadyExistTitle) {
    throw titleAlreadyExist(); 
  }
}

const credentialService = {
  createCredential,
};

export * from './errors';
export default credentialService;

