import { IEnvironmentsRepository } from '../../repositories/IEnvironmentsRepository';

interface IRequest {
  environment_id: string;
  user_id: string;
}

export class DeleteEnvironmentService {
  constructor(private environmentsRepository: IEnvironmentsRepository) {}

  public async execute({ environment_id, user_id }: IRequest): Promise<void> {
    const environment = await this.environmentsRepository.findByIdAndUserId(
      environment_id,
      user_id,
    );

    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }

    await this.environmentsRepository.delete(environment_id);
  }
}