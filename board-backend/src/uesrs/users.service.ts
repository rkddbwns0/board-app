import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UsersEntity from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/dto/users.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  async signUp(signupDto: SignupDto) {
    try {
      const user = await this.users.findOne({
        where: { email: signupDto.email },
      });
      if (user) {
        throw new HttpException(
          '이미 가입된 유저입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const password = this.hashPassword(signupDto.password);

      const signup_user = await this.users.create({
        email: signupDto.email,
        password: password,
        name: signupDto.name,
      });

      await this.users.save(signup_user);

      return { message: '회원가입이 완료되었습니다.' };
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async dupEmail(email: string) {
    try {
      const user = await this.users.findOne({
        where: { email: email },
      });

      if (user) {
        throw new HttpException('가입된 이메일입니다.', HttpStatus.BAD_REQUEST);
      }

      return { message: '가입 가능한 이메일입니다.' };
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }
}
