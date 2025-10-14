import { Actuator } from '@prisma/client';
import { IActuatorsRepository } from '../../repositories/IActuatorsRepository';

interface IRequest {
  actuator_id: string;
  environment_id: string; 
}

export class GetActuatorStateByDeviceService {
  constructor(private actuatorsRepository: IActuatorsRepository) {}

  public async execute({ actuator_id, environment_id }: IRequest): Promise<Actuator> {
    const actuator = await this.actuatorsRepository.findById(actuator_id);

    if (!actuator || actuator.environment_id !== environment_id) {
      throw new Error('Actuator not found in this environment.');
    }
    return actuator;
  }
}