import { prisma } from '@/config';
import { Prisma } from '@prisma/client';
import { Credential } from '@prisma/client';

export async function createCredential(data: Prisma.CredentialCreateManyInput): Promise<Credential>{
  return prisma.credential.create({
    data,
  });
}
