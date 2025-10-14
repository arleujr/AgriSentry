import { Request, Response } from 'express';
import { PrismaActuatorsRepository } from '../../repositories/implementations/PrismaActuatorsRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { SetActuatorModeService } from './SetActuatorModeService';
import { ActuatorControlMode } from '@prisma/client';

export class SetActuatorModeController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { actuatorId } = request.params;
      const { id: user_id } = request.user;
      const { mode } = request.body as { mode: ActuatorControlMode };

      if (mode !== 'MANUAL' && mode !== 'AUTOMATIC') {
        throw new Error('Invalid control mode provided.');
      }

      const actuatorsRepository = new PrismaActuatorsRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const setActuatorModeService = new SetActuatorModeService(
        actuatorsRepository,
        environmentsRepository,
      );

      const actuator = await setActuatorModeService.execute({
        actuator_id: actuatorId,
        user_id,
        mode,
      });

      return response.json(actuator);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const setActuatorModeController = new SetActuatorModeController();