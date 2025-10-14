import { Request, Response } from 'express';
import { PrismaEnvironmentsRepository } from '../../repositories/implementations/PrismaEnvironmentsRepository';
import { CreateEnvironmentService } from './CreateEnvironmentService';

export class CreateEnvironmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, description } = request.body;
      const { id: user_id } = request.user; 

      const environmentsRepository = new PrismaEnvironmentsRepository();
      const createEnvironmentService = new CreateEnvironmentService(
        environmentsRepository,
      );

      const environment = await createEnvironmentService.execute({
        name,
        description,
        user_id,
      });

      return response.status(201).json(environment);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const createEnvironmentController = new CreateEnvironmentController();