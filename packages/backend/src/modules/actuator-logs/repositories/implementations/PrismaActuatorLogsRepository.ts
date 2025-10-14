import { ActuatorLog } from '@prisma/client';
import { prisma } from '../../../../shared/database/prisma';
import { ICreateActuatorLogDTO } from '../../dtos/ICreateActuatorLogDTO';
import { IActuatorLogsRepository } from '../IActuatorLogsRepository';

export class PrismaActuatorLogsRepository implements IActuatorLogsRepository {
  public async create(data: ICreateActuatorLogDTO): Promise<ActuatorLog> {
    const log = await prisma.actuatorLog.create({
      data,
    });
    return log;
  }

  public async findByActuatorId(actuator_id: string): Promise<ActuatorLog[]> {
    const logs = await prisma.actuatorLog.findMany({
      where: {
        actuator_id,
      },
      orderBy: {
        created_at: 'desc', 
      },
      take: 50, 
    });
    return logs;
  }
}