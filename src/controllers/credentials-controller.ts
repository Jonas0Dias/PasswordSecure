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