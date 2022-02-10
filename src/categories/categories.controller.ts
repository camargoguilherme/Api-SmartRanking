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

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('_id', CategoryParameterValidationPipe) _id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(_id, updateCategoryDto);
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

  @Get(':_id')
  async searchCategoriesById(
    @Param('_id', CategoryParameterValidationPipe) _id: string,
  ): Promise<Category[] | Category> {
    return this.categoriesService.searchCategoryById(_id);
  }

  @Delete(':_id')
  async deleteCategory(
    @Param('_id', CategoryParameterValidationPipe) _id: string,
  ): Promise<Category> {
    return this.categoriesService.deleteCategoryById(_id);
  }
}
