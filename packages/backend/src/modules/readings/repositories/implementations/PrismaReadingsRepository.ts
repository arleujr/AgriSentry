import { prisma } from '../../../../shared/database/prisma';
import { ICreateReadingDTO } from '../../dtos/ICreateReadingDTO';
import { SensorReading } from '@prisma/client';
import { IReadingsRepository } from '../IReadingsRepository';

export class PrismaReadingsRepository implements IReadingsRepository {
  
  public async create(data: ICreateReadingDTO): Promise<SensorReading> {
    const reading = await prisma.sensorReading.create({ data });
    return reading;
  }
  
  public async findLatestBySensorId(sensor_id: string): Promise<SensorReading | null> {
    const reading = await prisma.sensorReading.findFirst({
      where: { sensor_id },
      orderBy: { created_at: 'desc' }, 
    });
    return reading;
  }

  public async findBySensorId(sensor_id: string): Promise<SensorReading[]> {
    const readings = await prisma.sensorReading.findMany({
      where: { sensor_id },
      orderBy: { created_at: 'asc' }, 
    });
    return readings;
  }

  public async deleteBySensorId(sensor_id: string): Promise<void> {
    await prisma.sensorReading.deleteMany({
      where: { sensor_id },
    });
  }
}
