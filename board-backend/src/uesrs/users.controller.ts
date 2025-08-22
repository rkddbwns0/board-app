import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import UsersService from './users.service';
import { SignupDto } from 'src/dto/users.dto';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signup(@Body() signupDto: SignupDto) {
    return await this.usersService.signUp(signupDto);
  }

  @Get()
  async dupEmail(@Query('email') email: string) {
    return await this.usersService.dupEmail(email);
  }
}
