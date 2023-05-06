import { Prisma} from '@prisma/client';
import { prisma } from '@/config';
import { Credential } from '@prisma/client';



async function create(data: Prisma.CredentialCreateManyInput): Promise<Credential>{
    return prisma.credential.create({
      data,
    });
  }



async function findByTitle(title: string) {
    return prisma.credential.findFirst({
      where:{
        title,
      }
    });
  } 



async function findMany(userId: number) {
    return prisma.credential.findMany({
      where:{
        userId,
      }
    });
  } 


  const credentialRepository = {
    findByTitle,
    create,
    findMany,
  };
  

  export default credentialRepository;
  
  