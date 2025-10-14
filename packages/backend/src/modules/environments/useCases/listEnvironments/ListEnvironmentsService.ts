import { Environment } from '@prisma/client';
import { IEnvironmentsRepository } from '../../repositories/IEnvironmentsRepository';

export class ListEnvironmentsService {
  constructor(private environmentsRepository: IEnvironmentsRepository) {}

  public async execute(user_id: string): Promise<Environment[]> {
    const environments = await this.environmentsRepository.findByUserId(user_id);
    return environments;
  }
}