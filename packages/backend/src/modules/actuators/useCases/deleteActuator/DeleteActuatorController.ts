import { Request, Response } from 'express';
import { PrismaActuatorsRepository } from '../../repositories/implementations/PrismaActuatorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { DeleteActuatorService } from './DeleteActuatorService';

export class DeleteActuatorController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { actuatorId } = request.params;
      const { id: user_id } = request.user;

      const actuatorsRepository = new PrismaActuatorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const deleteActuatorService = new DeleteActuatorService(
        actuatorsRepository,
        environmentsRepository,
      );

      await deleteActuatorService.execute({
        actuator_id: actuatorId,
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

export const deleteActuatorController = new DeleteActuatorController();