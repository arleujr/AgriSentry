import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/database/prisma';

export async function ensureApiKeyAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const apiKey = request.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    return response.status(401).json({ error: 'API Key is missing.' });
  }

  const environment = await prisma.environment.findFirst({
    where: { apiKey },
  });

  if (!environment) {
    return response.status(401).json({ error: 'Invalid API Key.' });
  }

  request.environment = {
    id: environment.id,
  };

  return next();
}