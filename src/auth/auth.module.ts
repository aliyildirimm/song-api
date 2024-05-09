import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './domain/auth.service';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';

// can i make this separate nest js service? as auth service
@Module({
  imports: [UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '3660s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
