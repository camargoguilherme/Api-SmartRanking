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
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayerParameterValidationPipe } from './pipes/player-parameters-validatiom.pipe';
import { PlayersService } from './players.service';
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('_id', PlayerParameterValidationPipe) _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playersService.updatePlayer(_id, updatePlayerDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  async searchPlayers(): Promise<Player[] | Player> {
    return this.playersService.searchAllPlayers();
  }

  @Get(':_id')
  async searchPlayersById(
    @Param('_id', PlayerParameterValidationPipe) _id: string,
  ): Promise<Player[] | Player> {
    return this.playersService.searchPlayerById(_id);
  }

  @Delete(':_id')
  async deletePlayer(
    @Param('_id', PlayerParameterValidationPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.deletePlayerById(_id);
  }
}
