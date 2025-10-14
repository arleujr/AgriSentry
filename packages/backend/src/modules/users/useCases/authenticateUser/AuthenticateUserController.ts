import { Request, Response } from 'express';
import { PrismaUsersRepository } from '../../repositories/implementations/PrismaUsersRepository';
import { AuthenticateUserService } from './AuthenticateUserService';

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;

      const usersRepository = new PrismaUsersRepository();
      const authenticateUserService = new AuthenticateUserService(
        usersRepository,
      );

      const { user, token } = await authenticateUserService.execute({
        email,
        password,
      });

      return response.json({ user, token });

    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message }); 
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const authenticateUserController = new AuthenticateUserController();