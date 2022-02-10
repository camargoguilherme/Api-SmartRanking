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

  async updateCategory(category: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(
      `[updateCategory] Category ${JSON.stringify(updateCategoryDto, null, 2)}`,
    );
    const CategoryUpdated = await this.CategoryModel.findOneAndUpdate(
      { category },
      { $set: updateCategoryDto },
      { new: true },
    ).exec();
    if (!CategoryUpdated)
      throw new NotFoundException(`Category '${category}' not found`);

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
      throw new ConflictException(`Category '${category}' already registered`);

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
  async searchCategoryById(category: string): Promise<Category> {
    this.logger.log(`[searchCategoryById] category ${category}`);
    const CategoryFound = await this.CategoryModel.findOne({ category }).exec();

    if (!CategoryFound)
      throw new NotFoundException(`Category '${category}' not found`);

    this.logger.log(
      `[searchCategoryById] Category ${JSON.stringify(CategoryFound, null, 2)}`,
    );
    return CategoryFound;
  }

  async deleteCategoryById(category: string): Promise<Category> {
    this.logger.log(`[deleteCategoryById] category ${category}`);
    const CategoryFound = await this.CategoryModel.findOneAndDelete({
      category,
    }).exec();

    if (!CategoryFound)
      throw new NotFoundException(`Category '${category}' not found`);

    return CategoryFound;
  }
}
