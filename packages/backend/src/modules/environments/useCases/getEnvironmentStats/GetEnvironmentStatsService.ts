import { prisma } from '../../../../shared/database/prisma';
import { IEnvironmentsRepository } from '../../repositories/IEnvironmentsRepository';

interface IRequest {
  environment_id: string;
  user_id: string;
}

interface IResponse {
  temperature: { _avg: number | null; _max: number | null; _min: number | null };
  humidity: { _avg: number | null; _max: number | null; _min: number | null };
  soil_moisture: { _avg: number | null; _max: number | null; _min: number | null };
}

export class GetEnvironmentStatsService {
  constructor(private environmentsRepository: IEnvironmentsRepository) {}

  public async execute({ environment_id, user_id }: IRequest): Promise<IResponse> {
    const environment = await this.environmentsRepository.findByIdAndUserId(
      environment_id,
      user_id,
    );
    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [tempStats, humidityStats, soilMoistureStats] = await Promise.all([
      prisma.sensorReading.aggregate({
        _avg: { value: true },
        _max: { value: true },
        _min: { value: true },
        where: {
          sensor: {
            environment_id,
            type: 'TEMPERATURE',
          },
          created_at: {
            gte: twentyFourHoursAgo,
          },
        },
      }),
      prisma.sensorReading.aggregate({
        _avg: { value: true },
        _max: { value: true },
        _min: { value: true },
        where: {
          sensor: {
            environment_id,
            type: 'HUMIDITY',
          },
          created_at: {
            gte: twentyFourHoursAgo,
          },
        },
      }),
      prisma.sensorReading.aggregate({
        _avg: { value: true },
        _max: { value: true },
        _min: { value: true },
        where: {
          sensor: {
            environment_id,
            type: 'SOIL_MOISTURE',
          },
          created_at: {
            gte: twentyFourHoursAgo,
          },
        },
      }),
    ]);

    return {
      temperature: {
        _avg: tempStats._avg.value,
        _max: tempStats._max.value,
        _min: tempStats._min.value,
      },
      humidity: {
        _avg: humidityStats._avg.value,
        _max: humidityStats._max.value,
        _min: humidityStats._min.value,
      },
      soil_moisture: {
        _avg: soilMoistureStats._avg.value,
        _max: soilMoistureStats._max.value,
        _min: soilMoistureStats._min.value,
      },
    };
  }
}
