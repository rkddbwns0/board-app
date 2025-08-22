import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dto/auth.dto';
import TokenEntity from 'src/entities/token.entity';
import UsersEntity from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,

    @InjectRepository(TokenEntity)
    private readonly token: Repository<TokenEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.users.findOne({
        where: { email: loginDto.email },
      });

      if (!bcrypt.compareSync(loginDto.password, user?.password) || !user) {
        throw new HttpException(
          '비밀번호가 일치하지 않습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = {
        user_id: user?.user_id,
        email: user?.email,
        name: user?.name,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '1h',
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '7d',
      });

      await this.saveToken(user?.user_id!, refresh_token);

      return {
        access_token: access_token,
        refresh_token: refresh_token,
      };
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }

  async saveToken(user_id: number, token: string) {
    try {
      const find_token = await this.token.findOne({
        where: { user_id: user_id },
      });

      if (find_token) {
        const newExpiresIn = new Date();
        newExpiresIn.setDate(newExpiresIn.getDate() + 7);

        await this.token.update(
          { user_id: user_id },
          { token: token, expires_in: newExpiresIn },
        );
        return;
      }

      const user_token = await this.token.create({
        user_id: user_id,
        token: token,
      });
      console.log(user_token);
      await this.token.save(user_token);
      return;
    } catch (e) {
      console.error(e);
    }
  }

  async refresh(user_id: number, refresh_token: string) {
    try {
      const token = await this.token.findOne({
        where: { user_id: user_id },
      });

      const user = await this.users.findOne({
        where: { user_id: user_id },
      });

      if (!token || token.token !== refresh_token) {
        throw new HttpException('잘못된 토큰입니다.', HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        user_id: user?.user_id,
        email: user?.email,
        name: user?.name,
      };

      const newAceessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '1h',
      });

      return { access_token: newAceessToken };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }

  async logout(user_id: number) {
    try {
      const delete_token = await this.token.delete({ user_id: user_id });
      console.log(delete_token);
      return;
    } catch (e) {}
  }
}
