import { SensorReading } from '@prisma/client';
import { ICreateReadingDTO } from '../dtos/ICreateReadingDTO';

export interface IReadingsRepository {
  create(data: ICreateReadingDTO): Promise<SensorReading>;
  findLatestBySensorId(sensor_id: string): Promise<SensorReading | null>;
  findBySensorId(sensor_id: string): Promise<SensorReading[]>;
  deleteBySensorId(sensor_id: string): Promise<void>;
}
