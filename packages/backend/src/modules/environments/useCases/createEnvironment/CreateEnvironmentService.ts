import { Environment } from '@prisma/client';
import { IEnvironmentsRepository } from '../../repositories/IEnvironmentsRepository';

interface IRequest {
  name: string;
  description?: string;
  user_id: string;
}

export class CreateEnvironmentService {
  constructor(private environmentsRepository: IEnvironmentsRepository) {}

  public async execute({
    name,
    description,
    user_id,
  }: IRequest): Promise<Environment> {
    const environment = await this.environmentsRepository.create({
      name,
      description,
      user_id,
    });

    return environment;
  }
}