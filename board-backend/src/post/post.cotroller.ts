import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:category_id')
  async getPost(@Param('category_id') category_id: number) {
    const id = Number(category_id);
    return this.postService.getPost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get('detail/:post_id')
  async getPostDetail(
    @Param('post_id', ParseIntPipe) post_id: number,
    @Query('user_id') user_id?: string | null,
  ) {
    let id: number | null;
    if (user_id) {
      id = Number(user_id);
    }
    await this.postService.incrementView(post_id, id!);

    return this.postService.getPostDetail(post_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':post_id')
  async updatePost(
    @Param('post_id') post_id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const id = Number(post_id);
    return this.postService.updatePost(post_id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':post_id')
  async deletePost(@Param('post_id') post_id: number) {
    return this.postService.deletePost(post_id);
  }
}
