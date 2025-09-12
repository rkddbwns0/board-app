import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePostCommentDto,
  DeleteCommentDto,
} from 'src/dto/post_comment.dto';
import PostEntity from 'src/entities/post.entity';
import { PostCommentEntity } from 'src/entities/post_comment.entity';
import UsersEntity from 'src/entities/users.entity';
import { MoreThan, Raw, Repository } from 'typeorm';

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
      const { post_id, user_id, comment, parent_id } = createpostCommentDto;
      const post_comment = new PostCommentEntity();

      const post = await this.post.findOneOrFail({
        where: { post_id: post_id },
      });

      const user = await this.user.findOneOrFail({
        where: { user_id: user_id },
      });

      if (!user || !post) {
        throw new HttpException('Not Found.', HttpStatus.NOT_FOUND);
      }

      post_comment.user_id = user;
      post_comment.post_id = post;
      post_comment.comment = comment;

      if (parent_id) {
        const parent_comment = await this.postComment.findOneOrFail({
          where: { comment_id: parent_id },
          relations: { user_id: true },
        });

        if (!parent_comment) {
          throw new HttpException('Not Found.', HttpStatus.NOT_FOUND);
        }
        post_comment.parent_id = parent_comment;
        await this.postComment.save(post_comment);
      } else {
        await this.postComment.save(post_comment);
      }

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
      const post = await this.post.findOneOrFail({
        where: { post_id: post_id },
      });

      if (!post) {
        throw new HttpException(
          '존재하지 않는 게시물입니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      const comment = await this.postComment
        .createQueryBuilder('comment')
        .addSelect(['users.user_id', 'users.name', 'users.email'])
        .addSelect(['post.post_id', 'post.title'])
        .addSelect([
          'childrenUser.user_id',
          'childrenUser.name',
          'childrenUser.email',
        ])
        .leftJoin('comment.user_id', 'users')
        .leftJoin('comment.post_id', 'post')
        .leftJoinAndSelect('comment.children', 'children')
        .leftJoin('children.user_id', 'childrenUser')
        .where('comment.post_id = :post_id', { post_id })
        .andWhere('comment.parent_id IS NULL')
        .orderBy('comment.comment_id', 'ASC')
        .addOrderBy('children.comment_id', 'ASC')
        .setParameter('post_id', post_id)
        .getMany();

      const formatComment = {
        comment: comment.map(
          ({
            comment_id,
            comment,
            user_id,
            children,
            created_at,
            updated_at,
            deleted_at,
          }) => ({
            comment_id,
            comment,
            user_id: user_id
              ? {
                  user_id: user_id.user_id,
                  name: user_id.name,
                  email: user_id.email,
                }
              : null,
            children:
              children.map(
                ({
                  comment_id,
                  comment,
                  user_id,
                  created_at,
                  updated_at,
                  deleted_at,
                }) => ({
                  comment_id,
                  comment,
                  user_id: user_id
                    ? {
                        user_id: user_id.user_id,
                        name: user_id.name,
                        email: user_id.email,
                      }
                    : null,
                  created_at,
                  updated_at,
                  deleted_at,
                }),
              ) ?? [],
            created_at: created_at,
            updated_at: updated_at,
            deleted_at: deleted_at,
          }),
        ),
      };

      return formatComment;
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }

  async DeleteCommentDto(deleteCommentDto: DeleteCommentDto) {
    try {
      const { comment_id } = deleteCommentDto;
      const comment = await this.postComment.findOneOrFail({
        where: { comment_id: comment_id },
        relations: { user_id: true },
      });

      console.log(comment);

      if (!comment) {
        throw new HttpException(
          '존재하지 않는 댓글입니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.postComment.delete({
        comment_id: comment_id,
        user_id: comment.user_id,
      });

      return { message: '댓글이 삭제되었습니다.' };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }
}
