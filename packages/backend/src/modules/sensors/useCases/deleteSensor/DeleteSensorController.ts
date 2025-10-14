import { Request, Response } from 'express';
import { PrismaSensorsRepository } from '../../repositories/implementations/PrismaSensorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { PrismaRulesRepository } from '../../../rules/repositories/implementations/PrismaRulesRepository';
import { PrismaReadingsRepository } from '../../../readings/repositories/implementations/PrismaReadingsRepository';
import { DeleteSensorService } from './DeleteSensorService';

export class DeleteSensorController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { sensorId } = request.params;
      const { id: user_id } = request.user;

      const sensorsRepository = new PrismaSensorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const rulesRepository = new PrismaRulesRepository();
      const readingsRepository = new PrismaReadingsRepository();

      const deleteSensorService = new DeleteSensorService(
        sensorsRepository,
        environmentsRepository,
        rulesRepository,
        readingsRepository,
      );

      await deleteSensorService.execute({
        sensor_id: sensorId,
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

export const deleteSensorController = new DeleteSensorController();