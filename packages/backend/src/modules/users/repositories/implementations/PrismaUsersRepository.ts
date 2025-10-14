import { prisma } from '../../../../shared/database/prisma';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class PrismaUsersRepository implements IUsersRepository {

  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }
}