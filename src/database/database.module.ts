import { DynamicModule, Injectable } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class DatabaseModule {
  public static async getNoSqlConnectionOptions(
    configService: ConfigService,
  ): Promise<MongooseModuleOptions> {
    const urlDB = configService.get<string>('MONGODB_URI');

    if (!urlDB) {
      throw new Error('Database config is missing');
    }
    return {
      uri: urlDB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
  public static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) =>
            DatabaseModule.getNoSqlConnectionOptions(configService),
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
