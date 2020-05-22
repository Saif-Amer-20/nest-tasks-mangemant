import { AuthCredantialsDto } from './dto/auth-credantial';
import { User } from './user.entity';
import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async singUp(authCredantialsDto: AuthCredantialsDto): Promise<void> {
    const { username, password } = authCredantialsDto;

    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.userName = username;
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('the UserName already taken');
      }
      throw new InternalServerErrorException();
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async validatUserPassword(
    authCredantialsDto: AuthCredantialsDto,
  ): Promise<string> {
    const { username, password } = authCredantialsDto;
    const user = await this.findOne({ where: { userName: username } });

    if (user && (await user.passwordValid(password))) {
      return username;
    }
    return null;
  }
}
