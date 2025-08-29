import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from 'src/entities/post.entity';
import { PostCommentEntity } from 'src/entities/post_comment.entity';
import UsersEntity from 'src/entities/users.entity';
import PostCommnetService from './post_comment.service';
import PostCommentController from './post_comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostCommentEntity, PostEntity, UsersEntity]),
  ],
  controllers: [PostCommentController],
  providers: [PostCommnetService],
})
export class PostCommentModule {}
