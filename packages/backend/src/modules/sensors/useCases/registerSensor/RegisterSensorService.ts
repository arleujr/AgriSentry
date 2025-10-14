import { Sensor } from '@prisma/client';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { ISensorsRepository } from '../../repositories/ISensorsRepository';
import { IRegisterSensorDTO } from '../../dtos/IRegisterSensorDTO';

export class RegisterSensorService {
  constructor(
    private sensorsRepository: ISensorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ name, type, environment_id, user_id }: IRegisterSensorDTO & { user_id: string }): Promise<Sensor> {
    const environment = await this.environmentsRepository.findByIdAndUserId(
      environment_id,
      user_id,
    );

    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }

    const sensor = await this.sensorsRepository.create({
      name,
      type,
      environment_id,
    });

    return sensor;
  }
}