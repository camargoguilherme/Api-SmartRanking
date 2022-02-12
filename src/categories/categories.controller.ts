import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParameterValidationPipe } from 'src/common/pipes/parameters-validation.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Put(':category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('category', ParameterValidationPipe) category: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(category, updateCategoryDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async searchCategories(): Promise<Category[] | Category> {
    return this.categoriesService.searchAllCategories();
  }

  @Get(':category')
  async searchCategoriesById(
    @Param('category', ParameterValidationPipe) category: string,
  ): Promise<Category[] | Category> {
    return this.categoriesService.searchCategoryById(category);
  }

  @Delete(':category')
  async deleteCategory(
    @Param('category', ParameterValidationPipe) category: string,
  ): Promise<Category> {
    return this.categoriesService.deleteCategoryById(category);
  }

  @Post(':category/player/:_id')
  async assignPlayerToCategory(
    @Param('category', ParameterValidationPipe) category: string,
    @Param('_id', ParameterValidationPipe) _id: string,
  ) {
    return this.categoriesService.assignPlayerToCategory(category, _id);
  }
}
