import { Actuator } from '@prisma/client';
import { IActuatorsRepository } from '../../repositories/IActuatorsRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';

interface IRequest {
  actuator_id: string;
  user_id: string;
}

export class GetActuatorDetailsService {
  constructor(
    private actuatorsRepository: IActuatorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ actuator_id, user_id }: IRequest): Promise<Actuator> {
    const actuator = await this.actuatorsRepository.findById(actuator_id);
    if (!actuator) {
      throw new Error('Actuator not found.');
    }

    const environment = await this.environmentsRepository.findByIdAndUserId(
      actuator.environment_id,
      user_id,
    );
    if (!environment) {
      throw new Error('User does not have permission to access this actuator.');
    }

    return actuator;
  }
}