import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CategoryEntity from './category.entity';
import UsersEntity from './users.entity';

@Entity('post')
export default class PostEntity {
  @PrimaryGeneratedColumn()
  post_id: number;

  @ManyToOne(() => CategoryEntity, (category) => category.category_id)
  @JoinColumn({ name: 'category_id' })
  category_id: CategoryEntity;

  @ManyToOne(() => UsersEntity, (user) => user.user_id)
  @JoinColumn({ name: 'writer' })
  writer: UsersEntity;

  @Column({ type: 'varchar', length: 30, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  content: string;

  @Column({ type: 'int', default: 0 })
  view: number;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @CreateDateColumn({ type: 'date', default: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'date' })
  deleted_at: Date;
}
