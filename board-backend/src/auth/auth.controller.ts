import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/auth.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const login = await this.authService.login(loginDto);

    res.cookie('refresh_token', login?.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return login?.access_token;
  }

  @Post('refresh')
  async refresh(@Body() body) {
    return await this.authService.refresh(body.user_id, body.refresh_token);
  }

  @Post('logout')
  async logout(@Body() user_id: number, @Res({ passthrough: true }) res) {
    res.clearCookie('refresh_token');
    return await this.authService.logout(user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async me(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
