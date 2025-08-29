import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import PostEntity from './post.entity';
import UsersEntity from './users.entity';

@Entity('post_comment')
export class PostCommentEntity {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @ManyToOne(() => PostEntity, (post) => post.post_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post_id: PostEntity;

  @ManyToOne(() => UsersEntity, (user) => user.user_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: UsersEntity;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(
    () => PostCommentEntity,
    (post_comment) => post_comment.comment_id,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'parent_id' })
  parent_id: PostCommentEntity;
}
