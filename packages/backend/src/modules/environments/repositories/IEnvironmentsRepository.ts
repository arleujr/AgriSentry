import { Environment } from '@prisma/client';
import { ICreateEnvironmentDTO } from '../dtos/ICreateEnvironmentDTO';

export interface IEnvironmentsRepository {
  create(data: ICreateEnvironmentDTO): Promise<Environment>;
  findByUserId(user_id: string): Promise<Environment[]>; 
  findByIdAndUserId(id: string, user_id: string): Promise<Environment | null>;
  delete(id: string): Promise<void>;
}
