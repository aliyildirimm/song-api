import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './domain/auth.service';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
