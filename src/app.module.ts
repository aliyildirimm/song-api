import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { PlaylistModule } from './playlist/playlist.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { ArtistModule } from './artist/artist.module';
import config from './common/config/configuration';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions  => ({
  type: 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  synchronize: configService.get('database.synchronize'),
  entities: [__dirname + '/**/*.entity.ts'], // Directly specifying the path
});

export const jwtConfig = (configService: ConfigService): JwtModuleOptions  => ({
  secret: configService.get('jwt.secret'),
  signOptions: { expiresIn: configService.get('jwt.expiresIn') },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      // The global option of JwtModule.registerAsync should be on the same
      // level as useFactory, not a part of the options returned by the useFactory
      global: true,
      useFactory: jwtConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    SongsModule,
    PlaylistModule,
    ArtistModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}

// maybe redis caching for the interceptors?