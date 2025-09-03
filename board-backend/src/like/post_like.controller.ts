import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import PostLikeService from './post_like.service';
import { PostLikeDto } from 'src/dto/post_like.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('post_like')
export default class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async postLike(@Body() postLikeDto: PostLikeDto) {
    return await this.postLikeService.likePost(postLikeDto);
  }
}
