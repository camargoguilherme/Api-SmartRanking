import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @Put()
  async updatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.updatePlayer(createPlayerDto);
  }

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  async searchPlayers(): Promise<Player[] | Player> {
    return this.playersService.searchAllPlayers();
  }
}
