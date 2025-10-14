import { Request, Response } from 'express';
import { PrismaReadingsRepository } from '../../repositories/implementations/PrismaReadingsRepository';
import { PrismaSensorsRepository } from '../../../sensors/repositories/implementations/PrismaSensorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { GetLatestReadingService } from './GetLatestReadingService';

export class GetLatestReadingController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { sensorId } = request.params;
      const { id: user_id } = request.user;

      const readingsRepository = new PrismaReadingsRepository();
      const sensorsRepository = new PrismaSensorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();

      const getLatestReadingService = new GetLatestReadingService(
        readingsRepository,
        sensorsRepository,
        environmentsRepository,
      );

      const reading = await getLatestReadingService.execute({
        sensor_id: sensorId,
        user_id,
      });

      return response.json(reading);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const getLatestReadingController = new GetLatestReadingController();