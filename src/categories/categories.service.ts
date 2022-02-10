import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private Categories: Category[] = [];

  constructor(
    @InjectModel('Category') private readonly CategoryModel: Model<Category>,
  ) { }

  async updateCategory(_id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(
      `[updateCategory] Category ${JSON.stringify(updateCategoryDto, null, 2)}`,
    );
    const CategoryUpdated = await this.CategoryModel.findByIdAndUpdate(
      _id,
      { $set: updateCategoryDto },
      { new: true },
    ).exec();
    if (!CategoryUpdated)
      throw new NotFoundException(`Category with _id '${_id}' not found`);

    this.logger.log(
      `[updateCategory] Category ${JSON.stringify(CategoryUpdated, null, 2)}`,
    );
    return CategoryUpdated;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    this.logger.log(
      `[createCategory] Category ${JSON.stringify(createCategoryDto, null, 2)}`,
    );

    const { category } = createCategoryDto;
    const hasCategory = await this.CategoryModel.findOne({ category }).exec();

    if (hasCategory)
      throw new ConflictException(
        `Category with category '${category}' already registered`,
      );

    const CategoryCreated = await this.CategoryModel.create(createCategoryDto);
    this.logger.log(
      `[createCategory] Category ${JSON.stringify(CategoryCreated, null, 2)}`,
    );
    return CategoryCreated;
  }

  // Find all Categories
  async searchAllCategories(): Promise<Category[]> {
    const allCategories = await this.CategoryModel.find().exec();
    this.logger.log(
      `[searchAllCategories] Category[] ${JSON.stringify(
        allCategories,
        null,
        2,
      )}`,
    );
    return allCategories;
  }

  // Find Category by email
  async searchCategoryById(_id: string): Promise<Category> {
    this.logger.log(`[searchCategoryById] _id ${_id}`);
    const CategoryFound = await this.CategoryModel.findById(_id).exec();

    if (!CategoryFound)
      throw new NotFoundException(`Category with _id '${_id}' not found`);

    this.logger.log(
      `[searchCategoryById] Category ${JSON.stringify(CategoryFound, null, 2)}`,
    );
    return CategoryFound;
  }

  async deleteCategoryById(_id: string): Promise<Category> {
    this.logger.log(`[deleteCategoryById] _id ${_id}`);
    const CategoryFound = await this.CategoryModel.findByIdAndRemove(
      _id,
    ).exec();

    if (!CategoryFound)
      throw new NotFoundException(`Category with _id '${_id}' not found`);

    return CategoryFound;
  }
}
