import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidacaoPipe } from './pipes/challenges-status-validatios';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

/*
Challenges
*/

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallegeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengesService.createChallenge(createChallegeDto);
  }

  @Get()
  async findChallenges(
    @Query('idPlayer') idPlayer: string,
  ): Promise<Array<Challenge>> {
    return idPlayer
      ? await this.challengesService.searchOnePlayerChallenge(idPlayer)
      : await this.challengesService.searchAllChallenges();
  }

  @Get(':_id')
  async searchChallengeById(@Param('_id') _id: string): Promise<Challenge> {
    return this.challengesService.searchChallengeById(_id);
  }

  @Put('/:_id')
  async updateChallenge(
    @Body(ChallengeStatusValidacaoPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('_id') _id: string,
  ): Promise<Challenge> {
    return this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:_id/match/')
  async assignChallengeMatch(
    @Body(ValidationPipe) assignChallengeMatchDto: AssignChallengeMatchDto,
    @Param('_id') _id: string,
  ): Promise<Challenge> {
    return await this.challengesService.assignChallengeMatch(
      _id,
      assignChallengeMatchDto,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<Challenge> {
    return this.challengesService.deleteChallenge(_id);
  }
}
