import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function create(data: Prisma.SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });
}

async function Find(userId: number) {
  return prisma.session.findFirst({
    where:{
      userId,
    }
   
  });
}



const sessionRepository = {
  create,
  Find
};

export default sessionRepository;
