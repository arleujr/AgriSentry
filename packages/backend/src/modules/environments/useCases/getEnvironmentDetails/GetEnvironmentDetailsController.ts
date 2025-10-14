import { Request, Response } from 'express';
import { PrismaEnvironmentsRepository } from '../../repositories/implementations/PrismaEnvironmentsRepository';
import { GetEnvironmentDetailsService } from './GetEnvironmentDetailsService';

export class GetEnvironmentDetailsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const environmentsRepository = new PrismaEnvironmentsRepository();
      const getEnvironmentDetailsService = new GetEnvironmentDetailsService(
        environmentsRepository,
      );

      const environment = await getEnvironmentDetailsService.execute({
        environment_id: environmentId,
        user_id,
      });

      return response.json(environment);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message }); 
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const getEnvironmentDetailsController =
  new GetEnvironmentDetailsController();