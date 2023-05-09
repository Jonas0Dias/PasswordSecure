import { User, Credential, Network } from "@prisma/client";


export type ApplicationError = {
  name: string;
  message: string;
};



export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type UserWithoutId = Omit<User, 'id'>;

export type CredentialWithoutId = Omit<Credential, 'id'>;
export type PostCredential = Pick<Credential, 'url' | 'username' | 'password' | 'title'>;
export type PostCredentialWithUserId = PostCredential & {
  userId: number;
}


export type NetworkWithouId = Omit<Network, 'id'>;
export type PostNetwork = Pick<Network, 'network' | 'password' | 'title'>;
export type PostNetworkWithUserId = PostNetwork & {
  userId: number;
}


