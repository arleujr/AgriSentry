import { Request, Response } from 'express';
import { PrismaSensorsRepository } from '../../repositories/implementations/PrismaSensorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { RegisterSensorService } from './RegisterSensorService';

export class RegisterSensorController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, type } = request.body;
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const sensorsRepository = new PrismaSensorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const registerSensorService = new RegisterSensorService(
        sensorsRepository,
        environmentsRepository,
      );

      const sensor = await registerSensorService.execute({
        name,
        type,
        environment_id: environmentId,
        user_id,
      });

      return response.status(201).json(sensor);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const registerSensorController = new RegisterSensorController();