import { prisma } from '../../../../shared/database/prisma';
import { IRegisterSensorDTO } from '../../dtos/IRegisterSensorDTO';
import { ISensorsRepository } from '../ISensorsRepository';
import { Sensor, SensorReading } from '@prisma/client';

// Este tipo especial diz ao TypeScript que estamos a retornar o Sensor com as suas leituras
type SensorWithReadings = Sensor & { readings: SensorReading[] };

export class PrismaSensorsRepository implements ISensorsRepository {
  async create(data: IRegisterSensorDTO): Promise<Sensor> {
    const sensor = await prisma.sensor.create({ data });
    return sensor;
  }

  async findByEnvironmentId(environment_id: string): Promise<SensorWithReadings[]> {
    const sensors = await prisma.sensor.findMany({
      where: { environment_id },
      include: {
        readings: {
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
    });
    return sensors;
  }

  async findById(id: string): Promise<Sensor | null> {
    const sensor = await prisma.sensor.findUnique({
      where: { id },
    });
    return sensor;
  }

  async delete(id: string): Promise<void> {
    await prisma.sensor.delete({
      where: { id },
    });
  }

  async findByNameInEnvironment(name: string, environment_id: string): Promise<Sensor | null> {
    const sensor = await prisma.sensor.findFirst({
      where: {
        name,
        environment_id,
      },
    });
    return sensor;
  }

  async findByUserId(user_id: string): Promise<Sensor[]> {
    const sensors = await prisma.sensor.findMany({
      where: {
        environment: {
          user_id,
        },
      },
    });
    return sensors;
  }
}
