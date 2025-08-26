import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import PostEntity from 'src/entities/post.entity';
import UsersEntity from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,

    @InjectRepository(PostEntity)
    private readonly post: Repository<PostEntity>,
  ) {}

  async getPost(category_id: number) {
    try {
      if (category_id === 0) {
        const allPosts = await this.post
          .createQueryBuilder('post')
          .select([
            'post.post_id AS 게시글번호',
            'category.category AS 카테고리',
            'post.title AS 제목',
            "TO_CHAR(post.created_at, 'YYYY-MM-DD') AS 작성일",
            'post.view AS 조회수',
            'post.likes AS 좋아요수',
            'users.name AS 작성자',
          ])
          .leftJoin('post.category_id', 'category')
          .leftJoin('post.writer', 'users')
          .orderBy('post.created_at', 'DESC')
          .getRawMany();
        return allPosts;
      }
      const posts = await this.post
        .createQueryBuilder('post')
        .select([
          'post.post_id AS 게시글번호',
          'category.category AS 카테고리',
          'post.title AS 제목',
          "TO_CHAR(post.created_at, 'YYYY-MM-DD') AS 작성일",
          'post.view AS 조회수',
          'post.likes AS 좋아요수',
          'users.name AS 작성자',
        ])
        .innerJoin(
          'post.category_id',
          'category',
          'post.category_id = category.category_id',
        )
        .innerJoin('post.writer', 'users', 'post.writer = users.user_id')
        .where('post.category_id = :category_id', { category_id })
        .orderBy('post.created_at', 'DESC')
        .getRawMany();
      return posts;
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        throw e;
      }
    }
  }

  async createPost(createPostDto: CreatePostDto) {
    try {
      const { category_id, writer, title, content } = createPostDto;

      const user = await this.users.findOne({
        where: { user_id: writer },
      });

      if (!user) {
        throw new HttpException(
          '존재하지 않는 유저입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPost = this.post.create({
        title: title,
        content: content,
        category_id: { category_id: category_id },
        writer: { user_id: user.user_id },
      });

      if (!newPost) {
        throw new HttpException(
          '게시글 생성에 실패했습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.post.save(newPost);
      return { message: '게시글이 성공적으로 생성되었습니다.' };
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        throw e;
      }
    }
  }

  async getPostDetail(post_id: number) {
    try {
      const post = await this.post
        .createQueryBuilder('post')
        .select([
          'category.category AS 카테고리',
          'post.title AS 제목',
          'post.content AS 내용',
          "TO_CHAR(post.created_at, 'YYYY-MM-DD') AS 작성일",
          'post.view AS 조회수',
          'post.likes AS 좋아요수',
          'users.name AS 작성자',
          'users.user_id AS user_id',
        ])
        .innerJoin(
          'post.category_id',
          'category',
          'post.category_id = category.category_id',
        )
        .innerJoin('post.writer', 'users', 'post.writer = users.user_id')
        .where('post.post_id = :post_id', { post_id })
        .getRawOne();

      if (!post) {
        throw new HttpException(
          '존재하지 않는 게시글입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return post;
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        throw e;
      }
    }
  }

  async incrementView(post_id: number, user_id?: number | null) {
    if (user_id) {
      await this.post
        .createQueryBuilder()
        .update()
        .set({ view: () => 'view + 1' })
        .where('post_id = :post_id', { post_id })
        .andWhere(user_id ? 'writer <> :writer' : '1=1', { writer: user_id })
        .execute();
    } else {
      await this.post
        .createQueryBuilder()
        .update()
        .set({ view: () => 'view + 1' })
        .where('post_id = :post_id', { post_id })
        .execute();
    }
    return;
  }

  async updatePost(post_id: number, updatePostDto: UpdatePostDto) {
    try {
      const { writer, title, content } = updatePostDto;

      const post = await this.post.findOne({
        where: {
          post_id: post_id,
          writer: { user_id: writer },
        },
      });

      if (!post) {
        throw new HttpException(
          '존재하지 않는 게시글이거나 권한이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.post
        .createQueryBuilder()
        .update()
        .set({ title, content })
        .where('post_id = :post_id', { post_id })
        .andWhere('writer = :writer', { writer: writer })
        .execute();

      return { message: '게시글이 성공적으로 수정되었습니다.' };
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          '게시글 수정에 실패했습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deletePost(post_id: number) {
    try {
      const post = await this.post.findOne({
        where: {
          post_id: post_id,
        },
      });

      if (!post) {
        throw new HttpException(
          '존재하지 않는 게시글입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.post.delete({ post_id: post_id });
      return { message: '게시글이 성공적으로 삭제되었습니다.' };
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }
}
