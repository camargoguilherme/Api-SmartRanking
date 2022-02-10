import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v1 as uuidv1 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async updatePlayer() { }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.create(createPlayerDto);
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { name, email, phoneNumber } = createPlayerDto;
    const player: Player = {
      _id: uuidv1(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      positionRanking: 1,
      urlProfilePlayer: 'https://google.com.br/foto123.jpg',
    };
    this.players.push(player);
    this.logger.log(`player ${JSON.stringify(player, null, 2)}`);
    return player;
  }
}
