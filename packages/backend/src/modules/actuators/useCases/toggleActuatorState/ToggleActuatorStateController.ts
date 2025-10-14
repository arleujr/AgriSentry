import { Request, Response } from 'express';
import { PrismaActuatorsRepository } from '../../repositories/implementations/PrismaActuatorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { PrismaActuatorLogsRepository } from '../../../actuator-logs/repositories/implementations/PrismaActuatorLogsRepository';
import { ToggleActuatorStateService } from './ToggleActuatorStateService';

export class ToggleActuatorStateController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { actuatorId } = request.params;
      const { id: user_id } = request.user;

      const actuatorsRepository = new PrismaActuatorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const actuatorLogsRepository = new PrismaActuatorLogsRepository();

      const toggleActuatorStateService = new ToggleActuatorStateService(
        actuatorsRepository,
        environmentsRepository,
        actuatorLogsRepository
      );

      const actuator = await toggleActuatorStateService.execute({
        actuator_id: actuatorId,
        user_id,
      });

      return response.json(actuator);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const toggleActuatorStateController = new ToggleActuatorStateController();
