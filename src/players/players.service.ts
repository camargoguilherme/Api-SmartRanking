import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v1 as uuidv1 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) { }

  async updatePlayer(createPlayerDto: CreatePlayerDto) {
    this.logger.log(
      `[updatePlayer] player ${JSON.stringify(createPlayerDto, null, 2)}`,
    );

    const { email } = createPlayerDto;
    const playerUpdated = await this.playerModel
      .findOneAndUpdate({ email }, { $set: createPlayerDto }, { new: true })
      .exec();
    if (!playerUpdated)
      throw new NotFoundException(`Player with email '${email}' not found`);

    this.logger.log(
      `[updatePlayer] player ${JSON.stringify(playerUpdated, null, 2)}`,
    );
    return playerUpdated;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    this.logger.log(
      `[createPlayer] player ${JSON.stringify(createPlayerDto, null, 2)}`,
    );

    const { email } = createPlayerDto;
    const hasPlayer = await this.playerModel.findOne({ email }).exec();

    if (hasPlayer)
      throw new ConflictException(
        `Player with email '${email}' already registered`,
      );

    const playerCreated = await this.playerModel.create(createPlayerDto);
    this.logger.log(
      `[createPlayer] player ${JSON.stringify(playerCreated, null, 2)}`,
    );
    return playerCreated;
  }

  // Find all players
  async searchAllPlayers(): Promise<Player[]> {
    const allPlayers = await this.playerModel.find().exec();
    this.logger.log(
      `[searchAllPlayers] player[] ${JSON.stringify(allPlayers, null, 2)}`,
    );
    return allPlayers;
  }

  // Find player by email
  async searchPlayerByEmail(email: string): Promise<Player> {
    this.logger.log(`[searchPlayerByEmail] email ${email}`);
    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (!playerFound)
      throw new NotFoundException(`Player with email '${email}' not found`);

    this.logger.log(
      `[searchPlayerByEmail] player ${JSON.stringify(playerFound, null, 2)}`,
    );
    return playerFound;
  }

  async deletePlayerByEmail(email: string): Promise<Player> {
    this.logger.log(`[deletePlayerByEmail] email ${email}`);
    const playerFound = await this.playerModel
      .findOneAndDelete({ email })
      .exec();

    if (!playerFound)
      throw new NotFoundException(`Player with email '${email}' not found`);

    return playerFound;
  }
}
