import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import credentialService from '@/services/credentials-service';

export async function credentialPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const {url, password, username, title } = req.body;
  const { userId } = req;

  try {
    const credential = await credentialService.createCredential({url, password, username, title, userId });
    return res.status(httpStatus.CREATED).json({
      credential
    });
  }  catch (e) {
      next(e);
  }
}

export async function credentialGetAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const searchAllCredentials = await credentialService.findAllCredentials(userId);
    return res.status(httpStatus.OK).json(
      searchAllCredentials
    );
  }  catch (e) {
      next(e);
  }
}


export async function credentialGetById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const credentialId =  Number(req.params.credentialId)

    const searchCredentialById = await credentialService.findUniqueCredential(userId, credentialId);
    return res.status(httpStatus.OK).json(
      searchCredentialById
    );
  }  catch (e) {
      next(e);
  }
}

export async function deleteCredentialById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const credentialId =  Number(req.params.credentialId)

    const deleteCredentialById = await credentialService.deleteCredentialById(userId, credentialId);
    return res.status(httpStatus.OK).json(
      deleteCredentialById
    );
  }  catch (e) {
      next(e);
  }
}







