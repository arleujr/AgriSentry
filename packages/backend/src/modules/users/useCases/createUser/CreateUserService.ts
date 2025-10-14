import { hash } from 'bcryptjs';
import { User } from '../../entities/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}



export class CreateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('User with this email already exists.');
    }

    const password_hash = await hash(password, 8); 
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return user;
  }
}