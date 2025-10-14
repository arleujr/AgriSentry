import { Request, Response } from 'express';
import { CreateUserService } from './CreateUserService';
import { PrismaUsersRepository } from '../../repositories/implementations/PrismaUsersRepository';

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;

      const usersRepository = new PrismaUsersRepository();
      
      const createUserService = new CreateUserService(usersRepository);

      const user = await createUserService.execute({ name, email, password });

      // @ts-ignore
      delete user.password_hash;

      return response.status(201).json(user);

    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const createUserController = new CreateUserController();