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
    this.logger.log(
      `[updatePlayer] player ${JSON.stringify(createPlayerDto, null, 2)}`,
    );

    const { email } = createPlayerDto;
    const hasPlayer = this.players.find((player) => player.email == email);
    if (!hasPlayer)
      throw new NotFoundException(`Player with email '${email}' not found`);

    return this.update(hasPlayer, createPlayerDto);
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    this.createPlayer.name;
    this.logger.log(
      `[createPlayer] player ${JSON.stringify(createPlayerDto, null, 2)}`,
    );

    const { email } = createPlayerDto;
    const hasPlayer = this.players.find((player) => player.email == email);

    if (hasPlayer)
      throw new ConflictException(
        `Player with email '${email}' already registered`,
      );

    return this.create(createPlayerDto);
  }

  // Find all players
  async searchAllPlayers(): Promise<Player[]> {
    this.logger.log(
      `[searchAllPlayers] player[] ${JSON.stringify(this.players, null, 2)}`,
    );
    return this.players;
  }

  // Find player by email
  async searchPlayerByEmail(email: string): Promise<Player> {
    this.logger.log(`[searchPlayerByEmail] email ${email}`);
    const playerFound = this.players.find((player) => player.email === email);

    if (!playerFound)
      throw new NotFoundException(`Player with email '${email}' not found`);

    this.logger.log(
      `[searchPlayerByEmail] player ${JSON.stringify(playerFound, null, 2)}`,
    );
    return playerFound;
  }

  async deletePlayerByEmail(email: string): Promise<Player> {
    this.logger.log(`[deletePlayerByEmail] email ${email}`);
    const playerFound = this.players.find((player) => player.email === email);

    if (!playerFound)
      throw new NotFoundException(`Player with email '${email}' not found`);

    this.players = this.players.filter((player) => player.email !== email);
    return playerFound;
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
    this.logger.log(`[create] player ${JSON.stringify(player, null, 2)}`);
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
      `[update] player ${JSON.stringify(playerUpdated, null, 2)}`,
    );
    return playerUpdated;
  }
}
