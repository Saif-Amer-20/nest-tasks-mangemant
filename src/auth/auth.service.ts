import { JwtPayload } from './jwt-payload.interface';
import { AuthCredantialsDto } from './dto/auth-credantial';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repositroy';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async singUp(authCredantialsDto: AuthCredantialsDto): Promise<void> {
    return this.userRepository.singUp(authCredantialsDto);
  }

  async singIn(
    authCredantialsDto: AuthCredantialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validatUserPassword(
      authCredantialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid Credantials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
