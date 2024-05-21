import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './data/repository/entitites';
import { UserService } from './domain/user.service';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './data/repository/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UsersRepository],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
