import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { hashPassword } from 'src/common/utils/bcrypt.utils';
import { UserSkinRelationsService } from 'src/modules/users/services/user-skin-relations.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userSkinRelationService: UserSkinRelationsService,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);

    return this.dataSource.transaction(async (manager) => {
      const user = await manager.save(User, {
        email: createUserDto.email,
        password: hashedPassword,
        username: createUserDto.username,
        birth_date: createUserDto.birth_date,
        gender: createUserDto.gender,
      });
      for (const attr_key of createUserDto.attributes) {
        await this.userSkinRelationService.addUserSkinRelation(
          user.user_key,
          attr_key,
          manager,
        );
      }
      return await manager.save(user);
    });
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
