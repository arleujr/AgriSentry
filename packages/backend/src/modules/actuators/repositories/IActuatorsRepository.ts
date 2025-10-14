import { Actuator } from '@prisma/client';
import { IRegisterActuatorDTO } from '../dtos/IRegisterActuatorDTO';

export interface IActuatorsRepository {
  create(data: IRegisterActuatorDTO): Promise<Actuator>;
  findById(id: string): Promise<Actuator | null>;
  findByEnvironmentId(environment_id: string): Promise<Actuator[]>;
  save(actuator: Actuator): Promise<Actuator>; 
  delete(id: string): Promise<void>;
}