import { SensorReading } from '@prisma/client';
import { IReadingsRepository } from '../../repositories/IReadingsRepository';
import { ISensorsRepository } from '../../../sensors/repositories/ISensorsRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';

interface IRequest {
  sensor_id: string;
  user_id: string;
}

export class ListReadingsBySensorService {
  constructor(
    private readingsRepository: IReadingsRepository, 
    private sensorsRepository: ISensorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ sensor_id, user_id }: IRequest): Promise<SensorReading[]> {
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

    const readings = await this.readingsRepository.findBySensorId(sensor_id);
    return readings;
  }
}