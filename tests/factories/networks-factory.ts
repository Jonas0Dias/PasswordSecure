import { prisma } from '@/config';
import { Prisma } from '@prisma/client';
import { Network } from '@prisma/client';

export async function createNetwork(data: Prisma.NetworkCreateManyInput): Promise<Network>{
  return prisma.network.create({
    data,
  });
}
