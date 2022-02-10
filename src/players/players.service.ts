import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v1 as uuidv1 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async updatePlayer(createPlayerDto: CreatePlayerDto) {
    const { email } = createPlayerDto;
    const hasPlayer = this.players.find((player) => player.email == email);
    if (!hasPlayer) throw new NotFoundException('Unregistered player');

    return this.update(hasPlayer, createPlayerDto);
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const hasPlayer = this.players.find((player) => player.email == email);

    if (hasPlayer) throw new ConflictException('Player already registered');

    return this.create(createPlayerDto);
  }

  // Find all players
  async searchAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  // Find player by email
  async searchPlayerByEmail(email: string): Promise<Player> {
    const _player = this.players.find((player) => player.email === email);
    return _player;
  }

  // Create player from parameter 'createPlayerDto'
  private async create(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player | null> {
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
    this.logger.log(`player ${JSON.stringify(player, null, 2)}`, 'create');
    return player;
  }

  private async update(
    playerFound: Player,
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player | null> {
    const { name, phoneNumber, email } = createPlayerDto;

    const playerUpdated = {
      ...playerFound,
      name,
      phoneNumber,
      email,
    };

    const indexOfPlayer = this.players.indexOf(playerFound);
    this.players[indexOfPlayer] = playerUpdated;

    this.logger.log(
      `player ${JSON.stringify(playerUpdated, null, 2)}`,
      'update',
    );
    return playerUpdated;
  }
}
