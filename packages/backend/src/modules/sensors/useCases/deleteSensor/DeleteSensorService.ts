import { ISensorsRepository } from '../../repositories/ISensorsRepository';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { IRulesRepository } from '../../../rules/repositories/IRulesRepository';
import { IReadingsRepository } from '../../../readings/repositories/IReadingsRepository';

interface IRequest {
  sensor_id: string;
  user_id: string;
}

export class DeleteSensorService {
  constructor(
    private sensorsRepository: ISensorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
    private rulesRepository: IRulesRepository,
    private readingsRepository: IReadingsRepository,
  ) {}

  public async execute({ sensor_id, user_id }: IRequest): Promise<void> {
    const sensor = await this.sensorsRepository.findById(sensor_id);
    if (!sensor) {
      throw new Error('Sensor not found.');
    }
    const environment = await this.environmentsRepository.findByIdAndUserId(
      sensor.environment_id,
      user_id,
    );
    if (!environment) {
      throw new Error('User does not have permission to delete this sensor.');
    }

    await this.readingsRepository.deleteBySensorId(sensor_id);
    await this.rulesRepository.deleteBySensorId(sensor_id);

    await this.sensorsRepository.delete(sensor_id);
  }
}