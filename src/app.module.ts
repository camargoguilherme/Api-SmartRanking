import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule.forRoot(), PlayersModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
