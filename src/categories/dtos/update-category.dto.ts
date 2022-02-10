import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';
import { Event } from '../interfaces/category.interface';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly events: Array<Event>;
}
