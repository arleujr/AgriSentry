import { Request, Response } from 'express';
import { PrismaSensorsRepository } from '../../repositories/implementations/PrismaSensorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
// A importação deve usar chaves porque a exportação não foi 'default'
import { ListSensorsByEnvironmentService } from './ListSensorsService';

export class ListSensorsByEnvironmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const sensorsRepository = new PrismaSensorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const listSensorsService = new ListSensorsByEnvironmentService(
        sensorsRepository,
        environmentsRepository,
      );

      const sensors = await listSensorsService.execute({
        environment_id: environmentId,
        user_id,
      });

      return response.json(sensors);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const listSensorsController = new ListSensorsByEnvironmentController();