import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PostCredentialWithUserId, CredentialWithoutId } from '@/protocols';
import { titleAlreadyExist } from './errors';
import credentialRepository from '@/repositories/credential-repository';
import { Credential } from '@prisma/client';
import { notFoundError } from '@/errors';

export async function createCredential(data: PostCredentialWithUserId) : Promise<Credential> {

  await validateUniqueTitle(data.title, data.userId);

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

async function validateUniqueTitle(title: string, userId: number) {
  const alreadyExistTitle = await credentialRepository.findByTitle(title, userId);
  console.log('test se ta entrando no validadeUniqueTitle')
  if (alreadyExistTitle) {
    throw titleAlreadyExist(); 
  }
}

async function findAllCredentials(userId: number): Promise<Credential[]> {
  const credential: Credential[] = await credentialRepository.findMany(userId)
  if (credential.length===0) throw notFoundError();
  return credential;
}

async function findUniqueCredential(userId: number, credentialId: number): Promise<Credential> {
  const credential: Credential = await credentialRepository.findById(userId, credentialId)
  if (!credential) throw notFoundError();
  console.log(credential)
  return credential;
}

async function deleteCredentialById(userId: number, credentialId: number) {
  const credential = await credentialRepository.deleteById(userId, credentialId)
  if (!credential) throw notFoundError();
  console.log(credential)
}





const credentialService = {
  createCredential,
  findAllCredentials,
  findUniqueCredential,
  deleteCredentialById
};

export * from './errors';
export default credentialService;

