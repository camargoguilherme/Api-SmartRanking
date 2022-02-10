import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayerParameterValidationPipe } from './pipes/player-parameters-validatiom.pipe';
import { PlayersService } from './players.service';
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @Put()
  async updatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.updatePlayer(createPlayerDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  async searchPlayers(
    @Query('email', PlayerParameterValidationPipe) email: string,
  ): Promise<Player[] | Player> {
    if (email) return this.playersService.searchPlayerByEmail(email);
    return this.playersService.searchAllPlayers();
  }

  @Delete()
  async deletePlayer(
    @Query('email', PlayerParameterValidationPipe) email: string,
  ): Promise<Player> {
    return this.playersService.deletePlayerByEmail(email);
  }
}
