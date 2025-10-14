import { Rule } from '@prisma/client';
import { ICreateRuleDTO } from '../dtos/ICreateRuleDTO';

export interface IRulesRepository {
  create(data: ICreateRuleDTO): Promise<Rule>;
  findByEnvironmentId(environment_id: string): Promise<Rule[]>;
  findById(id: string): Promise<Rule | null>;
  delete(id: string): Promise<void>;
  deleteBySensorId(sensor_id: string): Promise<void>;
  findByTriggerSensorId(sensor_id: string): Promise<Rule[]>; 
}