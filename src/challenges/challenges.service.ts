import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { Challenge, Match } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) { }

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    /*
    Check if the informed players are registered
    */

    const players = await this.playersService.searchAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFound = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFound.length == 0) {
        throw new BadRequestException(
          `The id '${playerDto._id}' is not a player!`,
        );
      }
    });

    /*
    Verify if the requester is one of the players in the match
    */

    const requesterIsPlayerOfTheMatch = createChallengeDto.players.filter(
      (player) => player._id == `${createChallengeDto.requester}`,
    );

    this.logger.log(
      `[createChallenge] requesterIsPlayerOfTheMatch: ${requesterIsPlayerOfTheMatch}`,
    );

    if (requesterIsPlayerOfTheMatch.length == 0) {
      throw new BadRequestException(
        `The requester must be a player in the match!`,
      );
    }

    /*
    find out the category based on the requesting player ID
    */
    const categoryPlayer = await this.categoriesService.searchPlayerCategory(
      `${createChallengeDto.requester}`,
    );

    /*
    To proceed the applicant must be part of a category
    */
    if (!categoryPlayer) {
      throw new BadRequestException(
        `The requestor must be registered in a category!`,
      );
    }

    const challengeCreated = new this.challengeModel(createChallengeDto);
    challengeCreated.category = categoryPlayer.category;
    challengeCreated.dateTimeRequest = new Date();
    /*
    When a challenge is created, we set the challenge status to pending
    */
    challengeCreated.status = ChallengeStatus.PENDING;
    this.logger.log(
      `[createChallenge] challengeCreated: ${JSON.stringify(challengeCreated)}`,
    );
    return await challengeCreated.save();
  }

  async searchChallengeById(_id: string): Promise<Challenge> {
    this.logger.log(`[searchChallengeById] _id ${_id}`);
    const challengeFound = await this.challengeModel
      .findById(_id)
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();

    if (!challengeFound)
      throw new NotFoundException(`Challenge with _id '${_id}' not found`);

    this.logger.log(
      `[searchChallengeById] Challenge ${JSON.stringify(
        challengeFound,
        null,
        2,
      )}`,
    );
    return challengeFound;
  }

  async searchAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async searchOnePlayerChallenge(_id: any): Promise<Array<Challenge>> {
    this.logger.log(`[searchOnePlayerChallenge] _id ${_id}`);
    await this.playersService.searchPlayerById(_id);

    const allChallengesOfPlayer = await this.challengeModel
      .find()
      .where('players')
      .in([_id])
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();

    if (!allChallengesOfPlayer) {
      throw new NotFoundException(
        `Player's challenges with id '${_id}' not found!`,
      );
    }

    this.logger.log(
      `[searchOnePlayerChallenge] allChallengesOfPlayer ${allChallengesOfPlayer}`,
    );
    return allChallengesOfPlayer;
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(
      `[createChallenge] _id ${_id}, updateChallengeDto: ${JSON.stringify(
        updateChallengeDto,
      )}`,
    );

    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new NotFoundException(`Challenge with id '${_id}' not registered!`);
    }

    /*
    Update the date of the response when the challenge status comes filled 
    */
    if (updateChallengeDto.status) {
      challengeFound.dateTimeResponse = new Date();
    }
    challengeFound.status = updateChallengeDto.status;
    challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    this.logger.log(
      `[createChallenge] challengeFound: ${JSON.stringify(challengeFound)}`,
    );

    return this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .populate('players')
      .exec();
  }

  async assignChallengeMatch(
    _id: string,
    assignChallengeMatchDto: AssignChallengeMatchDto,
  ): Promise<Challenge> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    /*
    Check if the winning player is part of the challenge
    */
    const playerFilter = challengeFound.players.filter(
      (player) => player._id == `${assignChallengeMatchDto.def}`,
    );

    this.logger.log(`[assignChallengeMatch] challengeFound: ${challengeFound}`);
    this.logger.log(`[assignChallengeMatch] playerFilter: ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `The winning player is not part of the challenge!`,
      );
    }

    /*
    First, let's create and persist the match object
    */
    const matchCreated = new this.matchModel(assignChallengeMatchDto);

    /*
    Assign the broken object the category retrieved in the challenge
    */
    matchCreated.category = challengeFound.category;

    /*
    Assign the players who took part in the challenge to the match object
    */
    matchCreated.players = challengeFound.players;

    const result = await matchCreated.save();

    /*
    When a match is registered by a user, we will change the 
    status of the challenge to held
    */
    challengeFound.status = ChallengeStatus.REALIZED;

    /*  
    We retrieve the match ID and assign it to the challenge
    */
    challengeFound.match = result._id;

    try {
      return this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challengeFound })
        .populate('requester')
        .populate('players')
        .populate('match')
        .exec();
    } catch (error) {
      /*
      If the challenge update fails, we delete the previously 
      previously saved
      */
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string): Promise<Challenge> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge with id '${_id}' not registered!
      `);
    }

    /*
    We will logically delete the challenge, changing its status to
    CANCELLED
    */
    challengeFound.status = ChallengeStatus.CANCELLED;

    return this.challengeModel
      .findOneAndDelete({ _id }, { $set: challengeFound })
      .exec();
  }
}
