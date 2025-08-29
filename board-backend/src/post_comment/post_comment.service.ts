import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostCommentDto } from 'src/dto/post_comment.dto';
import PostEntity from 'src/entities/post.entity';
import { PostCommentEntity } from 'src/entities/post_comment.entity';
import UsersEntity from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class PostCommnetService {
  constructor(
    @InjectRepository(PostCommentEntity)
    private readonly postComment: Repository<PostCommentEntity>,

    @InjectRepository(PostEntity)
    private readonly post: Repository<PostEntity>,

    @InjectRepository(UsersEntity)
    private readonly user: Repository<UsersEntity>,
  ) {}

  async createPostComment(createpostCommentDto: CreatePostCommentDto) {
    try {
      const { post_id, user_id, comment, comment_id } = createpostCommentDto;

      const post = await this.post.findOne({ where: { post_id: post_id } });

      if (!post) {
        throw new HttpException(
          '존재하지 않는 게시글입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.user.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw new HttpException(
          '유저 정보가 존재하지 않습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPostComment = this.postComment.create({
        post_id: { post_id: post_id },
        user_id: { user_id: user_id },
        comment: comment,
        ...(comment_id ? { parent_id: { comment_id: comment_id } } : null),
      });

      await this.postComment.save(newPostComment);

      return { message: '댓글이 입력되었습니다.' };
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }

  async getPostComment(post_id: number) {
    try {
      const post_comment = await this.postComment
        .createQueryBuilder('p')
        .select([
          `p.comment_id AS comment_id, 
          p.comment AS parent_comment, 
          p.created_at AS parent_created_at, 
          u.name AS 작성자, 
          c.parent_id AS parent_id, 
          c.comment AS child_comment, 
          c.created_at AS child_created_at`,
        ])
        .innerJoin(UsersEntity, 'u', 'p.user_id = u.user_id')
        .leftJoin('post_comment', 'c', 'c.parent_id = p.comment_id')
        .where('p.post_id = :post_id', { post_id: post_id })
        .andWhere('p.parent_id IS NULL')
        .orderBy('p.created_at', 'ASC')
        .addOrderBy('c.created_at', 'ASC')
        .getRawMany();

      return post_comment;
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }
}
