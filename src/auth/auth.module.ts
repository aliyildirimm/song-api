import { Module } from '@nestjs/common';

import { AuthController } from './api/auth.controller';
import { AuthService } from './domain/auth.service';
import { UserModule } from 'src/users/user.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [UserModule, ArtistModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
