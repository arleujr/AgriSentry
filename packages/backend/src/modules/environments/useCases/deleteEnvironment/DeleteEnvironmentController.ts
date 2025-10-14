import { Request, Response } from 'express';
import { PrismaEnvironmentsRepository } from '../../repositories/implementations/PrismaEnvironmentsRepository';
import { DeleteEnvironmentService } from './DeleteEnvironmentService';

export class DeleteEnvironmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const environmentsRepository = new PrismaEnvironmentsRepository();
      const deleteEnvironmentService = new DeleteEnvironmentService(environmentsRepository);

      await deleteEnvironmentService.execute({
        environment_id: environmentId,
        user_id,
      });

      return response.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const deleteEnvironmentController = new DeleteEnvironmentController();