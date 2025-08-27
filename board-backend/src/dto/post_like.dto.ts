import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostLikeDto {
  @IsNotEmpty()
  @IsNumber()
  post_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
