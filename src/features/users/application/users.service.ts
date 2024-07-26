import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { User } from '@features/users/domain/user.entity';
import { HashBuilder } from '@utils/hash-builder';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashBuilder: HashBuilder,
  ) {}

  async create(
    login: string,
    password: string,
    email: string,
  ): Promise<string> {
    const passwordHash = await this.hashBuilder.hash(password);

    const newUser: User = {
      login,
      password: passwordHash,
      email,
      createdAt: new Date(),
    };

    return await this.usersRepository.create(newUser);
  }

  async delete(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
}
