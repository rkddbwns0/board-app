import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import PostEntity from './post.entity';
import TokenEntity from './token.entity';

@Entity('users')
export default class UsersEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'date', default: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'date' })
  deleted_at: Date;

  @Column({ type: 'timestamp' })
  last_login: Date;

  @OneToMany(() => PostEntity, (post) => post.writer)
  posts: PostEntity[];

  @OneToOne(() => TokenEntity, (token) => token.user_id)
  token: TokenEntity;
}
