import { Request, Response } from 'express';
import { PrismaActuatorsRepository } from '../../repositories/implementations/PrismaActuatorsRepository';
import { GetActuatorStateByDeviceService } from './GetActuatorStateByDeviceService';

export class GetActuatorStateByDeviceController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { actuatorId } = request.params;
      const { id: environment_id } = request.environment;

      const actuatorsRepository = new PrismaActuatorsRepository();
      const getActuatorStateByDeviceService = new GetActuatorStateByDeviceService(actuatorsRepository);
      const actuator = await getActuatorStateByDeviceService.execute({
        actuator_id: actuatorId,
        environment_id,
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

export const getActuatorStateByDeviceController = new GetActuatorStateByDeviceController();