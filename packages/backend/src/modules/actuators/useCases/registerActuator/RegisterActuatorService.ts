import { Actuator, ActuatorType } from '@prisma/client';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { IActuatorsRepository } from '../../repositories/IActuatorsRepository';

interface IRequest {
  name: string;
  type: ActuatorType;
  environment_id: string;
  user_id: string; 
}

export class RegisterActuatorService {
  constructor(
    private actuatorsRepository: IActuatorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({
    name,
    type,
    environment_id,
    user_id,
  }: IRequest): Promise<Actuator> {

    const environment = await this.environmentsRepository.findByIdAndUserId(
      environment_id,
      user_id,
    );

    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }


    const actuator = await this.actuatorsRepository.create({
      name,
      type,
      environment_id,
    });

    return actuator;
  }
}