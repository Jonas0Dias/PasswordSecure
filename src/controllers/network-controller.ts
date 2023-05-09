import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import networkService from '@/services/networks-service';

export async function networkPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const {network, password, title } = req.body;
  const { userId } = req;

  try {
    const credential = await networkService.createNetwork({network, password, title, userId });
    return res.status(httpStatus.CREATED).json({
      credential
    });
  }  catch (e) {
      next(e);
  }
}

export async function networkGetAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const searchAllNetworks = await networkService.findAllNetworks(userId);
    return res.status(httpStatus.OK).json(
        searchAllNetworks
    );
  }  catch (e) {
      next(e);
  }
}


export async function networkGetById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const networkId =  Number(req.params.networkId)
    
    if(!networkId) return res.status(httpStatus.BAD_REQUEST) 

    const searchNetworkById = await networkService.findUniqueNetwork(userId, networkId);
    return res.status(httpStatus.OK).json(
        searchNetworkById
    );
  }  catch (e) {
      next(e);
  }
}

export async function deleteNetworkById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const networkId =  Number(req.params.networkId)

    const deleteNetworkById = await networkService.deleteNetworkById(userId, networkId);
    return res.status(httpStatus.OK).json(
        deleteNetworkById
    );
  }  catch (e) {
      next(e);
  }
}