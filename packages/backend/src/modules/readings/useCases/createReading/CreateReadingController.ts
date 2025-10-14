import { Request, Response } from 'express';
import { PrismaReadingsRepository } from '../../repositories/implementations/PrismaReadingsRepository';
import { PrismaSensorsRepository } from '../../../sensors/repositories/implementations/PrismaSensorsRepository';
import { PrismaRulesRepository } from '../../../rules/repositories/implementations/PrismaRulesRepository';
import { PrismaActuatorsRepository } from '../../../actuators/repositories/implementations/PrismaActuatorsRepository';
import { PrismaActuatorLogsRepository } from '../../../actuator-logs/repositories/implementations/PrismaActuatorLogsRepository'; // Importe o repo de logs
import { CreateReadingService } from './CreateReadingService';

export class CreateReadingController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { sensor_id, value } = request.body;
      const { id: environment_id } = request.environment;

      const readingsRepository = new PrismaReadingsRepository();
      const sensorsRepository = new PrismaSensorsRepository();
      const rulesRepository = new PrismaRulesRepository();
      const actuatorsRepository = new PrismaActuatorsRepository();
      const actuatorLogsRepository = new PrismaActuatorLogsRepository(); // Crie a instância

      const createReadingService = new CreateReadingService(
        readingsRepository,
        sensorsRepository,
        rulesRepository,
        actuatorsRepository,
        actuatorLogsRepository, // Passe a instância aqui
      );

      const reading = await createReadingService.execute({
        value,
        sensor_id,
        environment_id,
      });

      return response.status(201).json(reading);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const createReadingController = new CreateReadingController();