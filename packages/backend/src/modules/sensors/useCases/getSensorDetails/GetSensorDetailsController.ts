import { Request, Response } from 'express';
import { PrismaSensorsRepository } from '../../repositories/implementations/PrismaSensorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { GetSensorDetailsService } from './GetSensorDetailsService';

export class GetSensorDetailsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { sensorId } = request.params;
      const { id: user_id } = request.user;

      const sensorsRepository = new PrismaSensorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const getSensorDetailsService = new GetSensorDetailsService(
        sensorsRepository,
        environmentsRepository,
      );

      const sensor = await getSensorDetailsService.execute({
        sensor_id: sensorId,
        user_id,
      });

      return response.json(sensor);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const getSensorDetailsController = new GetSensorDetailsController();