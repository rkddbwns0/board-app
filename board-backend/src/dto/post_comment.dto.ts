import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

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
  parent_id?: number;
}

export class GetPostCommentDto {
  @IsNotEmpty()
  @IsNumber()
  commnet_id: number;

  @IsNotEmpty()
  @IsNumber()
  post_id: number;

  writer: GetCommentWriterDto;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsDate()
  created_at: Date;

  @IsBoolean()
  is_edited: boolean;

  @IsBoolean()
  can_deleted: boolean;
}

export class GetCommentWriterDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  is_writer: boolean;
}

export class DeleteCommentDto {
  @IsNotEmpty()
  @IsNumber()
  comment_id: number;
}
