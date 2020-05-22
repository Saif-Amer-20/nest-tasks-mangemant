import { User } from './user.entity';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthCredantialsDto } from './dto/auth-credantial';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decoreator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/singUp')
  async singUp(@Body(ValidationPipe) authCredantialsDto: AuthCredantialsDto) {
    return this.authService.singUp(authCredantialsDto);
  }

  @Post('/singIn')
  async singIn(
    @Body(ValidationPipe) authCredantialsDto: AuthCredantialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(authCredantialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
