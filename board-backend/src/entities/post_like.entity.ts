import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import PostEntity from './post.entity';
import UsersEntity from './users.entity';

@Entity('post_like')
export default class PostLikeEntity {
  @PrimaryGeneratedColumn()
  like_id: number;

  @ManyToOne(() => PostEntity, (post) => post.post_id)
  @JoinColumn({ name: 'post_id' })
  post_id: PostEntity;

  @ManyToOne(() => UsersEntity, (user) => user.user_id)
  @JoinColumn({ name: 'user_id' })
  user_id: UsersEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
