import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';

@Module({
  imports: [SongsModule],
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
