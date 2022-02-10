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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';
import { CategoryParameterValidationPipe } from './pipes/category-parameters-validatiom.pipe';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Put(':categoria')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('categoria', CategoryParameterValidationPipe) categoria: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(categoria, updateCategoryDto);
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
    @Param('category', CategoryParameterValidationPipe) category: string,
  ): Promise<Category[] | Category> {
    return this.categoriesService.searchCategoryById(category);
  }

  @Delete(':category')
  async deleteCategory(
    @Param('category', CategoryParameterValidationPipe) category: string,
  ): Promise<Category> {
    return this.categoriesService.deleteCategoryById(category);
  }
}
