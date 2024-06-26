import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public';
import { UserService } from 'src/users/domain/user.service';

interface User {
  userId: number;
  username: string;
  artistId: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      // next two functions will help us to fetch the current handler and the class
      // and then it checks if that class has been signed as public by checking if IS_PUBLIC_KEY exists.
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? 'secret',
      });

      // i added this because if a user is deleted, i don't want that token to be valid anymore
      // could be found more efficient way to do this but for now this is enough
      const user = await this.userService.getUserById(payload.userId);
      if (user.length === 0) {
        throw new UnauthorizedException('User not found');
      }

      request['user'] = payload;
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Jwt Expired');
      }
      throw new UnauthorizedException('Error while verifying token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
