import { Body, Controller, Post } from '@nestjs/common';
import PostLikeService from './post_like.service';
import { PostLikeDto } from 'src/dto/post_like.dto';

@Controller('post_like')
export default class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post()
  async postLike(@Body() postLikeDto: PostLikeDto) {
    return await this.postLikeService.likePost(postLikeDto);
  }
}
