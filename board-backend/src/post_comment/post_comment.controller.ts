import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import PostCommnetService from './post_comment.service';
import { CreatePostCommentDto } from 'src/dto/post_comment.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('post_comment')
export default class PostCommentController {
  constructor(private readonly postCommentService: PostCommnetService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPostComment(@Body() createpostCommentDto: CreatePostCommentDto) {
    return await this.postCommentService.createPostComment(
      createpostCommentDto,
    );
  }

  @Get(':post_id')
  async getPostComment(@Param('post_id') post_id: number) {
    return await this.postCommentService.getPostComment(post_id);
  }
}
