import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from 'src/dto/post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:category_id')
  async getPost(@Param('category_id') category_id: number) {
    const id = Number(category_id);
    return this.postService.getPost(id);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get('detail/:post_id')
  async getPostDetail(@Param('post_id') post_id: number) {
    const id = Number(post_id);
    return this.postService.getPostDetail(id);
  }

  @Delete(':post_id')
  async deletePost(@Param('post_id') post_id: number) {
    return this.postService.deletePost(post_id);
  }
}
