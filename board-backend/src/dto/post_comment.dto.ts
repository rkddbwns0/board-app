import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostCommentDto {
  @IsNotEmpty()
  @IsNumber()
  post_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  comment_id?: number;
}
