import { Actuator } from '@prisma/client';
import { IActuatorsRepository } from '../../repositories/IActuatorsRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { IActuatorLogsRepository } from '../../../actuator-logs/repositories/IActuatorLogsRepository';
interface IRequest {
  actuator_id: string;
  user_id: string;
}

export class ToggleActuatorStateService {
  constructor(
    private actuatorsRepository: IActuatorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
    private actuatorLogsRepository: IActuatorLogsRepository // NOVO REPOSITÓRIO
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
      throw new Error('User does not have permission to toggle this actuator.');
    }

    actuator.is_on = !actuator.is_on;

    const updatedActuator = await this.actuatorsRepository.save(actuator);

    await this.actuatorLogsRepository.create({
      actuator_id: updatedActuator.id,
      action: updatedActuator.is_on ? 'TURNED_ON' : 'TURNED_OFF',
      triggered_by: 'MANUAL',
    });

    return updatedActuator;
  }
}
