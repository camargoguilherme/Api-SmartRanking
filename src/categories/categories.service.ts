import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) { }

  async updateCategory(category: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(
      `[updateCategory] Category ${JSON.stringify(updateCategoryDto, null, 2)}`,
    );
    const categoryUpdated = await this.categoryModel
      .findOneAndUpdate(
        { category },
        { $set: updateCategoryDto },
        { new: true },
      )
      .exec();
    if (!categoryUpdated)
      throw new NotFoundException(`Category '${category}' not found`);

    this.logger.log(
      `[updateCategory] Category ${JSON.stringify(categoryUpdated, null, 2)}`,
    );
    return categoryUpdated;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    this.logger.log(
      `[createCategory] Category ${JSON.stringify(createCategoryDto, null, 2)}`,
    );

    const { category } = createCategoryDto;
    const hasCategory = await this.categoryModel.findOne({ category }).exec();

    if (hasCategory)
      throw new ConflictException(`Category '${category}' already registered`);

    const categoryCreated = await this.categoryModel.create(createCategoryDto);
    this.logger.log(
      `[createCategory] Category ${JSON.stringify(categoryCreated, null, 2)}`,
    );
    return categoryCreated;
  }

  // Find all Categories
  async searchAllCategories(): Promise<Category[]> {
    const allCategories = await this.categoryModel
      .find()
      .populate('players')
      .exec();
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
    const categoryFound = await this.categoryModel
      .findOne({ category })
      .populate('players')
      .exec();

    if (!categoryFound)
      throw new NotFoundException(`Category '${category}' not found`);

    this.logger.log(
      `[searchCategoryById] Category ${JSON.stringify(categoryFound, null, 2)}`,
    );
    return categoryFound;
  }

  async searchPlayerCategory(_id: any): Promise<Category> {
    /*
    Challenge
    Scope of the exception reallocated to the Categories Service
    Check if the informed player is already registered
    */

    await this.playersService.searchPlayerById(_id);

    return await this.categoryModel.findOne().where('players').in(_id).exec();
  }

  async deleteCategoryById(category: string): Promise<Category> {
    this.logger.log(`[deleteCategoryById] category ${category}`);
    const categoryFound = await this.categoryModel
      .findOneAndDelete({
        category,
      })
      .exec();

    if (!categoryFound)
      throw new NotFoundException(`Category '${category}' not found`);

    return categoryFound;
  }

  async assignPlayerToCategory(category: string, _id: string) {
    this.logger.log(
      `[assignPlayerToCategory] category ${category}, _id ${_id}`,
    );

    const categoryFound = await this.categoryModel
      .findOne({
        category,
      })
      .exec();

    const hasPlayerInCategory = await this.categoryModel
      .findOne({
        category,
      })
      .where('players')
      .in([_id])
      .exec();

    const playerFound = await this.playersService.searchPlayerById(_id);

    if (!categoryFound)
      throw new NotFoundException(`Category '${category}' not found`);

    if (hasPlayerInCategory)
      throw new ConflictException(
        `Player with _id '${_id}' already registered in the category '${category}'`,
      );

    categoryFound.players.push(playerFound);

    this.logger.log(
      `[assignPlayerToCategory] category ${JSON.stringify(
        categoryFound,
        null,
        2,
      )}`,
    );

    return this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryFound }, { new: true })
      .populate('players')
      .exec();
  }
}
