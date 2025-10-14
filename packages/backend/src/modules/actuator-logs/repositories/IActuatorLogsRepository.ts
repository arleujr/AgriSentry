import { ActuatorLog } from '@prisma/client';
import { ICreateActuatorLogDTO } from '../dtos/ICreateActuatorLogDTO';

export interface IActuatorLogsRepository {
  create(data: ICreateActuatorLogDTO): Promise<ActuatorLog>;
  findByActuatorId(actuator_id: string): Promise<ActuatorLog[]>;
}