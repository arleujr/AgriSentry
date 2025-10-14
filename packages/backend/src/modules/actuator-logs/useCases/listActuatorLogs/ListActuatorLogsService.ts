import { ActuatorLog } from '@prisma/client';
import { IActuatorLogsRepository } from '../../repositories/IActuatorLogsRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { IActuatorsRepository } from '../../../actuators/repositories/IActuatorsRepository';

interface IRequest {
  actuator_id: string;
  user_id: string;
}

export class ListActuatorLogsService {
  constructor(
    private actuatorLogsRepository: IActuatorLogsRepository,
    private actuatorsRepository: IActuatorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ actuator_id, user_id }: IRequest): Promise<ActuatorLog[]> {
    const actuator = await this.actuatorsRepository.findById(actuator_id);
    if (!actuator) {
      throw new Error('Actuator not found.');
    }
    const environment = await this.environmentsRepository.findByIdAndUserId(
      actuator.environment_id,
      user_id,
    );
    if (!environment) {
      throw new Error('User does not have permission to access these logs.');
    }

    const logs = await this.actuatorLogsRepository.findByActuatorId(actuator_id);
    return logs;
  }
}