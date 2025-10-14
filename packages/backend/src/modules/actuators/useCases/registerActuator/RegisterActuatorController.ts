import { Request, Response } from 'express';
import { PrismaActuatorsRepository } from '../../repositories/implementations/PrismaActuatorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { RegisterActuatorService } from './RegisterActuatorService';

export class RegisterActuatorController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, type } = request.body;
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const actuatorsRepository = new PrismaActuatorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const registerActuatorService = new RegisterActuatorService(
        actuatorsRepository,
        environmentsRepository,
      );

      const actuator = await registerActuatorService.execute({
        name,
        type,
        environment_id: environmentId,
        user_id,
      });

      return response.status(201).json(actuator);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const registerActuatorController = new RegisterActuatorController();