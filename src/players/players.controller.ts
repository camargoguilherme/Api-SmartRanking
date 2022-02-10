import { Body, Controller, Post, Put } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
@Controller('api/v1/players')
export class PlayersController {
  @Put()
  async updatePlayer() {
    return JSON.stringify({
      name: 'Guilherme Camargo',
    });
  }

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const { name, email, phoneNumer } = createPlayerDto;

    return {
      name,
      email,
      phoneNumer,
    };
  }
}
