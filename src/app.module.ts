import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SongsController } from './songs/api/song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongEntity } from './songs/data/repositories/entities/song.entity';

@Module({
  imports: [SongsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [SongEntity],
      synchronize: true, // set true for the development purposes for now
    })
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(SongsController);
  }
}
