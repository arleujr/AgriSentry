import { Sensor } from '@prisma/client';
import { IRegisterSensorDTO } from '../dtos/IRegisterSensorDTO';

export interface ISensorsRepository {
  create(data: IRegisterSensorDTO): Promise<Sensor>;
  findByEnvironmentId(environment_id: string): Promise<Sensor[]>;
  findById(id: string): Promise<Sensor | null>;
  delete(id: string): Promise<void>;
}