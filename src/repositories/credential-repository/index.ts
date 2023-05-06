import { Prisma} from '@prisma/client';
import { prisma } from '@/config';
import { Credential } from '@prisma/client';



async function create(data: Prisma.CredentialCreateManyInput): Promise<Credential>{
    return prisma.credential.create({
      data,
    });
  }



async function findByTitle(title: string, userId:number) {
    return prisma.credential.findFirst({
      where:{
        title,
        userId
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

  async function findById(userId: number, credentialId: number) {
    return prisma.credential.findFirst({
      where:{
        userId,
        id: credentialId
      }
    });
  } 

  async function deleteById(userId: number, credentialId: number) {
    return prisma.credential.deleteMany({
      where:{
        id: credentialId,
        userId,
      }
    });
  } 

  



  


  const credentialRepository = {
    findByTitle,
    create,
    findMany,
    findById,
    deleteById
  };
  

  export default credentialRepository;
  
  