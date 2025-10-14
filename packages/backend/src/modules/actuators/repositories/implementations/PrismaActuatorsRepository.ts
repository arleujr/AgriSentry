import { prisma } from '../../../../shared/database/prisma';
import { IRegisterActuatorDTO } from '../../dtos/IRegisterActuatorDTO';
import { IActuatorsRepository } from '../IActuatorsRepository';
import { Actuator } from '@prisma/client';

export class PrismaActuatorsRepository implements IActuatorsRepository {
  public async create(data: IRegisterActuatorDTO): Promise<Actuator> {
    const actuator = await prisma.actuator.create({ data });
    return actuator;
  }

  public async findById(id: string): Promise<Actuator | null> {
    const actuator = await prisma.actuator.findUnique({ where: { id } });
    return actuator;
  }

  public async findByEnvironmentId(environment_id: string): Promise<Actuator[]> {
    const actuators = await prisma.actuator.findMany({ where: { environment_id } });
    return actuators;
  }

  public async save(actuator: Actuator): Promise<Actuator> {
    const updatedActuator = await prisma.actuator.update({
      where: { id: actuator.id },
      data: actuator,
    });
    return updatedActuator;
  }

  public async delete(id: string): Promise<void> {
    await prisma.actuator.delete({
      where: { id },
    });
  }
}
