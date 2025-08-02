import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    userInput: CreateUserDto,
    manager: EntityManager,
  ): Promise<User> {
    return await manager.save(User, userInput);
  }

  findOneByKey(user_key: number): Promise<User> {
    return this.usersRepository.findOneBy({ user_key });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
