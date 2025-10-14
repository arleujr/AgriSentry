import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token is missing.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT Secret not configured.');
    }

    const { sub: user_id } = verify(token, secret) as IPayload;

    request.user = {
      id: user_id,
    };

    return next(); 
  } catch {
    return response.status(401).json({ error: 'Invalid token.' });
  }
}