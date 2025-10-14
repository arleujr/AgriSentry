import { Actuator } from '@prisma/client';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { IActuatorsRepository } from '../../repositories/IActuatorsRepository';

interface IRequest {
  environment_id: string;
  user_id: string;
}

export class ListActuatorsService {
  constructor(
    private actuatorsRepository: IActuatorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ environment_id, user_id }: IRequest): Promise<Actuator[]> {
    const environment = await this.environmentsRepository.findByIdAndUserId(
      environment_id,
      user_id,
    );

    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }

    const actuators = await this.actuatorsRepository.findByEnvironmentId(environment_id);
    return actuators;
  }
}