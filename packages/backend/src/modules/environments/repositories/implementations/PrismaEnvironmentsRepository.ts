import { prisma } from '../../../../shared/database/prisma';
import { ICreateEnvironmentDTO } from '../../dtos/ICreateEnvironmentDTO';
import { IEnvironmentsRepository } from '../IEnvironmentsRepository';
import { Environment } from '@prisma/client';

export class PrismaEnvironmentsRepository implements IEnvironmentsRepository {
  async create({
    name,
    description,
    user_id,
  }: ICreateEnvironmentDTO): Promise<Environment> {
    const environment = await prisma.environment.create({
      data: {
        name,
        description,
        user_id,
      },
    });

    return environment;
  }

  async findByIdAndUserId(
    id: string,
    user_id: string,
  ): Promise<Environment | null> {
    const environment = await prisma.environment.findFirst({
      where: {
        id,
        user_id,
      },
    });

    return environment;
  }

  async findByUserId(user_id: string): Promise<Environment[]> {
    const environments = await prisma.environment.findMany({
      where: {
        user_id,
      },
    });

    return environments;
  }

  async delete(id: string): Promise<void> {
    await prisma.environment.delete({
      where: { id },
    });
  }
}
