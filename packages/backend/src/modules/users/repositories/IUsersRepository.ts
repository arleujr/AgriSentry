import { User } from "../entities/User"; 
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: ICreateUserDTO): Promise<User>;
}