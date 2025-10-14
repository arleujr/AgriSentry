import { IRulesRepository } from '../../repositories/IRulesRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';

interface IRequest {
  rule_id: string;
  user_id: string;
}

export class DeleteRuleService {
  constructor(
    private rulesRepository: IRulesRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ rule_id, user_id }: IRequest): Promise<void> {
    const rule = await this.rulesRepository.findById(rule_id); 
    if (!rule) {
      throw new Error('Rule not found.');
    }

    const environment = await this.environmentsRepository.findByIdAndUserId(
      rule.environment_id,
      user_id,
    );
    if (!environment) {
      throw new Error('User does not have permission to delete this rule.');
    }

    await this.rulesRepository.delete(rule_id);
  }
}