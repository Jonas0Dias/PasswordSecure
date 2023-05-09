import { Network, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PostNetworkWithUserId } from '@/protocols';
import { titleAlreadyExist } from './errors';
import networkRepository from '@/repositories/network-repository';
import { Credential } from '@prisma/client';
import { notFoundError } from '@/errors';


export async function createNetwork(data: PostNetworkWithUserId) : Promise<Network> {

  await validateUniqueTitle(data.title, data.userId);

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const dados = {
    network: data.network,
    title: data.title,
    password: hashedPassword,
    userId: data.userId,
  } 
  
  return networkRepository.create(
    dados
  );
}

async function validateUniqueTitle(title: string, userId: number) {
  const alreadyExistTitle = await networkRepository.findByTitle(title, userId);
  console.log('test se ta entrando no validadeUniqueTitle')
  if (alreadyExistTitle) {
    throw titleAlreadyExist(); 
  }
}

async function findAllNetworks(userId: number): Promise<Network[]> {
  const network: Network[] = await networkRepository.findMany(userId)
  if (network.length===0) throw notFoundError();
  return network;
}

async function findUniqueNetwork(userId: number, networkId: number): Promise<Network> {
  const network: Network = await networkRepository.findById(userId, networkId)
  if (!network) throw notFoundError();
  return network
  ;
}

async function deleteNetworkById(userId: number, networkId: number) {
  const network = await networkRepository.deleteById(userId, networkId)
  if (!network) throw notFoundError();
}





const networkService = {
  createNetwork,
  findAllNetworks,
  findUniqueNetwork,
  deleteNetworkById
};

export * from './errors';
export default networkService;

