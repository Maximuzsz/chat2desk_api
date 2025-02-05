import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { jwtUtils } from '../utils/jwtUtils';


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    throw new AppError(401, 'Token de autenticação não fornecido');
  }

  try {
    const decoded = jwtUtils.verifyToken(removeBearer(token));
    next();
  } catch (err) {
    throw new AppError(401, 'Token de autenticação inválido');
  }
};


function removeBearer(token: string): string {
  if (token.startsWith('Bearer ')) {
    return token.slice(7);
  }
  return token;
}