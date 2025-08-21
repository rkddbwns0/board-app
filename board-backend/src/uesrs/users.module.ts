import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UsersEntity from 'src/entities/users.entity';
import UsersController from './users.controller';
import UserService from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UserService],
})
export class UserModule {}
