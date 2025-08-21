import { Body, Controller, Post } from '@nestjs/common';
import UsersService from './users.service';
import { SignupDto } from 'src/dto/users.dto';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signup(@Body() signupDto: SignupDto) {
    return await this.usersService.signUp(signupDto);
  }

  @Post()
  async dupEmail(@Body() email: string) {
    return await this.usersService.dupEmail(email);
  }
}
