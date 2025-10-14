import { Sensor } from '@prisma/client';
import { ISensorsRepository } from '../../repositories/ISensorsRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';

interface IRequest {
  sensor_id: string;
  user_id: string;
}

export class GetSensorDetailsService {
  constructor(
    private sensorsRepository: ISensorsRepository,
    private environmentsRepository: IEnvironmentsRepository, 
  ) {}

  public async execute({ sensor_id, user_id }: IRequest): Promise<Sensor> {
    const sensor = await this.sensorsRepository.findById(sensor_id);

    if (!sensor) {
      throw new Error('Sensor not found.');
    }

    const environment = await this.environmentsRepository.findByIdAndUserId(
      sensor.environment_id,
      user_id,
    );

    if (!environment) {
      throw new Error('User does not have permission to access this sensor.');
    }

    return sensor;
  }
}