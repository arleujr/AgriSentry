import { IActuatorsRepository } from '../../repositories/IActuatorsRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';

interface IRequest {
  actuator_id: string;
  user_id: string;
}

export class DeleteActuatorService {
  constructor(
    private actuatorsRepository: IActuatorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ actuator_id, user_id }: IRequest): Promise<void> {
    const actuator = await this.actuatorsRepository.findById(actuator_id);
    if (!actuator) {
      throw new Error('Actuator not found.');
    }

    const environment = await this.environmentsRepository.findByIdAndUserId(
      actuator.environment_id,
      user_id,
    );
    if (!environment) {
      throw new Error('User does not have permission to delete this actuator.');
    }

    await this.actuatorsRepository.delete(actuator_id);
  }
}