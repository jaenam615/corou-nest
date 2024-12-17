import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Gender } from '../../../common/enum/gender.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    email: string,
    password: string,
    username: string,
    birth_date: Date,
    gender: Gender,
    transactionalEntityManager: any,
  ) {
    const user = this.usersRepository.create({
      email,
      password,
      username,
      birth_date,
      gender,
    });

    return transactionalEntityManager.save(User, user);
  }

  findOneByKey(user_key: number) {
    return this.usersRepository.findOneBy({ user_key });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  findAllUsers() {
    return this.usersRepository.find();
  }
}
