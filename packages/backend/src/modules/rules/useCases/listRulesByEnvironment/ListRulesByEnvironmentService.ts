import { Rule } from '@prisma/client';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { IRulesRepository } from '../../repositories/IRulesRepository';

interface IRequest {
  environment_id: string;
  user_id: string;
}

export class ListRulesByEnvironmentService {
  constructor(
    private rulesRepository: IRulesRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ environment_id, user_id }: IRequest): Promise<Rule[]> {
    // Checagem de segurança para garantir que o usuário é dono do ambiente
    const environment = await this.environmentsRepository.findByIdAndUserId(
      environment_id,
      user_id,
    );

    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }

    const rules = await this.rulesRepository.findByEnvironmentId(environment_id);
    return rules;
  }
}