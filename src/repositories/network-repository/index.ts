import { Prisma} from '@prisma/client';
import { prisma } from '@/config';
import { Network } from '@prisma/client';



async function create(data: Prisma.NetworkCreateManyInput): Promise<Network>{
    return prisma.network.create({
      data,
    });
  }



async function findByTitle(title: string, userId:number) {
    return prisma.network.findFirst({
      where:{
        title,
        userId
      }
    });
  } 



async function findMany(userId: number) {
    return prisma.network.findMany({
      where:{
        userId,
      }
    });
  } 

  async function findById(userId: number, networkId: number) {
    return prisma.network.findFirst({
      where:{
        userId,
        id: networkId
      }
    });
  } 

  async function deleteById(userId: number, networkId: number) {
    return prisma.network.deleteMany({
      where:{
        id: networkId,
        userId,
      }
    });
  } 

  



  


  const networkRepository = {
    findByTitle,
    create,
    findMany,
    findById,
    deleteById
  };
  

  export default networkRepository;
  
  