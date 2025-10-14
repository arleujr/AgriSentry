import { Request, Response } from 'express';
import { PrismaActuatorsRepository } from '../../repositories/implementations/PrismaActuatorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { ListActuatorsService } from './ListActuatorsService';

export class ListActuatorsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const actuatorsRepository = new PrismaActuatorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const listActuatorsService = new ListActuatorsService(
        actuatorsRepository,
        environmentsRepository,
      );

      const actuators = await listActuatorsService.execute({
        environment_id: environmentId,
        user_id,
      });

      return response.json(actuators);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const listActuatorsController = new ListActuatorsController();