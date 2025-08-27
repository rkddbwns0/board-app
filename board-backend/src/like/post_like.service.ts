import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLikeDto } from 'src/dto/post_like.dto';
import PostEntity from 'src/entities/post.entity';
import PostLikeEntity from 'src/entities/post_like.entity';
import UsersEntity from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class PostLikeService {
  constructor(
    @InjectRepository(PostLikeEntity)
    private readonly postLike: Repository<PostLikeEntity>,

    @InjectRepository(PostEntity)
    private readonly post: Repository<PostEntity>,

    @InjectRepository(UsersEntity)
    private readonly user: Repository<UsersEntity>,
  ) {}

  async likePost(postLikeDto: PostLikeDto) {
    try {
      const post = await this.post.findOne({
        where: { post_id: postLikeDto.post_id },
      });

      const user = await this.user.findOne({
        where: { user_id: postLikeDto.user_id },
      });

      if (!post || !user) {
        throw new HttpException(
          '게시글 혹은 사용자 정보가 존재하지 않습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const like = await this.postLike
        .createQueryBuilder('post_like')
        .where('post_like.post_id = :post_id', { post_id: postLikeDto.post_id })
        .andWhere('post_like.user_id = :user_id', {
          user_id: postLikeDto.user_id,
        })
        .getOne();

      if (like) {
        await this.post.decrement({ post_id: postLikeDto.post_id }, 'likes', 1);
        await this.postLike.delete(like.like_id);
        return { message: '좋아요 취소' };
      } else {
        await this.post.increment({ post_id: postLikeDto.post_id }, 'likes', 1);

        const newLike = this.postLike.create({
          post_id: post,
          user_id: user,
        });
        await this.postLike.save(newLike);
        return { message: '좋아요' };
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }
}
