import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './domain/auth.service';
import { UserModule } from 'src/users/user.module';

// can i make this separate nest js service? as auth service
@Module({
  imports: [UserModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
