import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import PostEntity from './post.entity';

@Entity('category')
export default class CategoryEntity {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  category: string;

  @OneToMany(() => PostEntity, (post) => post.category_id)
  posts: PostEntity[];
}
