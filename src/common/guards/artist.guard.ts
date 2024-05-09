import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ArtistGuard implements CanActivate {
  constructor(
) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new UnauthorizedException('User is not authenticated, access denied');
    }

    const artistId = request.user.artistId;
    if (!artistId) {
      throw new UnauthorizedException('User is not an artist, access denied');
    }
    return true;
  }
}