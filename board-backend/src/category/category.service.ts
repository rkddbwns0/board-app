import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CategoryEntity from 'src/entities/category.entity';
import PostEntity from 'src/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly category: Repository<CategoryEntity>,

    @InjectRepository(PostEntity)
    private readonly post: Repository<PostEntity>,
  ) {}

  async getCategory() {
    try {
      const category = await this.category.find({});
      return category;
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }
}
