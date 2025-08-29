import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import PostCommnetService from './post_comment.service';
import { CreatePostCommentDto } from 'src/dto/post_comment.dto';

@Controller('post_comment')
export default class PostCommentController {
  constructor(private readonly postCommentService: PostCommnetService) {}

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
