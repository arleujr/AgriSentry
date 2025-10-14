import { Request, Response } from 'express';
import { PrismaActuatorLogsRepository } from '../../repositories/implementations/PrismaActuatorLogsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { PrismaActuatorsRepository } from '../../../actuators/repositories/implementations/PrismaActuatorsRepository';
import { ListActuatorLogsService } from './ListActuatorLogsService';

export class ListActuatorLogsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { actuatorId } = request.params;
      const { id: user_id } = request.user;
      
      const actuatorLogsRepository = new PrismaActuatorLogsRepository();
      const actuatorsRepository = new PrismaActuatorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();

      const listActuatorLogsService = new ListActuatorLogsService(
        actuatorLogsRepository,
        actuatorsRepository,
        environmentsRepository,
      );

      const logs = await listActuatorLogsService.execute({
        actuator_id: actuatorId,
        user_id,
      });

      return response.json(logs);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}
export const listActuatorLogsController = new ListActuatorLogsController();