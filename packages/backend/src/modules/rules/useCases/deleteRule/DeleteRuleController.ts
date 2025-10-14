import { Request, Response } from 'express';
import { PrismaRulesRepository } from '../../repositories/implementations/PrismaRulesRepository';
import { PrismaEnvironmentsRepository } from '../../../environments/repositories/implementations/PrismaEnvironmentsRepository';
import { DeleteRuleService } from './DeleteRuleService';

export class DeleteRuleController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { ruleId } = request.params;
      const { id: user_id } = request.user;

      const rulesRepository = new PrismaRulesRepository();
      const environmentsRepository = new PrismaEnvironmentsRepository();
      const deleteRuleService = new DeleteRuleService(
        rulesRepository,
        environmentsRepository,
      );

      await deleteRuleService.execute({
        rule_id: ruleId,
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

export const deleteRuleController = new DeleteRuleController();