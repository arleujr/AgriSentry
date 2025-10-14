import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from '../../entities/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}


export class AuthenticateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
   const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error('Invalid email or password.'); 
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT Secret not configured.');
    }

    const token = sign({}, secret, {
      subject: user.id, 
      expiresIn: '1d', 
    });

    // @ts-ignore
    delete user.password_hash;

    return {
      user,
      token,
    };
  }
}