import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from 'src/entities/post.entity';
import UsersEntity from 'src/entities/users.entity';
import { PostController } from './post.cotroller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, PostEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
