import { Sensor, SensorReading } from '@prisma/client';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { ISensorsRepository } from '../../repositories/ISensorsRepository';

type SensorWithStatus = Omit<Sensor, 'readings'> & { status: 'ACTIVE' | 'INACTIVE' | 'NO_DATA' };

// A exportação é feita aqui na declaração da classe
export class ListSensorsByEnvironmentService {
  constructor(
    private sensorsRepository: ISensorsRepository,
    private environmentsRepository: IEnvironmentsRepository,
  ) {}

  public async execute({ environment_id, user_id }: { environment_id: string; user_id: string }): Promise<SensorWithStatus[]> {
    const environment = await this.environmentsRepository.findByIdAndUserId(
      environment_id,
      user_id,
    );
    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }

    // @ts-ignore
    const sensors: (Sensor & { readings: SensorReading[] })[] = await this.sensorsRepository.findByEnvironmentId(environment_id);
    
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const sensorsWithStatus = sensors.map(sensor => {
      const { readings, ...restOfSensor } = sensor;
      const latestReading = readings[0];
      let status: 'ACTIVE' | 'INACTIVE' | 'NO_DATA' = 'NO_DATA';

      if (latestReading) {
        if (new Date(latestReading.created_at) > twoMinutesAgo) {
          status = 'ACTIVE';
        } else {
          status = 'INACTIVE';
        }
      }
      
      return { ...restOfSensor, status };
    });

    return sensorsWithStatus;
  }
}