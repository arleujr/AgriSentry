import { Request, Response } from 'express';
import { PrismaEnvironmentsRepository } from '../../repositories/implementations/PrismaEnvironmentsRepository';
import { GetEnvironmentStatsService } from './GetEnvironmentStatsService';

export class GetEnvironmentStatsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const environmentsRepository = new PrismaEnvironmentsRepository();
      const getEnvironmentStatsService = new GetEnvironmentStatsService(
        environmentsRepository,
      );

      const stats = await getEnvironmentStatsService.execute({
        environment_id: environmentId,
        user_id,
      });

      return response.json(stats);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const getEnvironmentStatsController = new GetEnvironmentStatsController();