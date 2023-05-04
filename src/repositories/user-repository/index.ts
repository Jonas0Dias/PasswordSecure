import { Prisma } from '@prisma/client';
import { prisma } from '@/config';
import { CreateUserParams } from '@/services/users-service';
async function findByEmail(email: string) {

  return prisma.user.findUnique(
    {
    where: {
      email,
    },
  });
}

async function create(data: CreateUserParams) {
  return prisma.user.create({
    data,
  });
}

const userRepository = {
  findByEmail,
  create,
};

export default userRepository;
