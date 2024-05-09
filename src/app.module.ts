import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SongsController } from './songs/api/song.controller';
import { PlaylistModule } from './playlist/playlist.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true, // set true for the development purposes for now
    }),
    AuthModule,
    SongsModule,
    PlaylistModule,
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
