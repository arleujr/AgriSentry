import { Request, Response } from 'express';
import { PrismaRulesRepository } from '../../repositories/implementations/PrismaRulesRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { ListRulesByEnvironmentService } from './ListRulesByEnvironmentService';

export class ListRulesByEnvironmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { environmentId } = request.params;
      const { id: user_id } = request.user;

      const rulesRepository = new PrismaRulesRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const listRulesByEnvironmentService = new ListRulesByEnvironmentService(
        rulesRepository,
        environmentsRepository,
      );

      const rules = await listRulesByEnvironmentService.execute({
        environment_id: environmentId,
        user_id,
      });

      return response.json(rules);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const listRulesByEnvironmentController = new ListRulesByEnvironmentController();