import { Request, Response } from 'express';
import { PrismaRulesRepository } from '../../repositories/implementations/PrismaRulesRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { PrismaSensorsRepository } from '../../../sensors/repositories/implementations/PrismaSensorsRepository';
import { PrismaActuatorsRepository } from '../../../actuators/repositories/implementations/PrismaActuatorsRepository';
import { CreateRuleService } from './CreateRuleService';

export class CreateRuleController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { 
        name,
        environment_id,
        trigger_sensor_id,
        trigger_condition,
        trigger_value,
        action_actuator_id,
        action_type,
       } = request.body;
      const { id: user_id } = request.user;

      const rulesRepository = new PrismaRulesRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const sensorsRepository = new PrismaSensorsRepository();
      const actuatorsRepository = new PrismaActuatorsRepository();

      const createRuleService = new CreateRuleService(
        rulesRepository,
        environmentsRepository,
        sensorsRepository,
        actuatorsRepository,
      );

      const rule = await createRuleService.execute({
        name,
        environment_id,
        trigger_sensor_id,
        trigger_condition,
        trigger_value,
        action_actuator_id,
        action_type,
        user_id,
      });

      return response.status(201).json(rule);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const createRuleController = new CreateRuleController();