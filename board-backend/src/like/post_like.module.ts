import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostLikeEntity from 'src/entities/post_like.entity';
import PostLikeController from './post_like.controller';
import PostLikeService from './post_like.service';
import PostEntity from 'src/entities/post.entity';
import UsersEntity from 'src/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLikeEntity, PostEntity, UsersEntity]),
  ],
  controllers: [PostLikeController],
  providers: [PostLikeService],
})
export class PostLikeModule {}
