import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import TokenEntity from 'src/entities/token.entity';
import UsersEntity from 'src/entities/users.entity';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, TokenEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { issuer: 'board-app' },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtService, AuthService],
})
export class AuthModule {}
