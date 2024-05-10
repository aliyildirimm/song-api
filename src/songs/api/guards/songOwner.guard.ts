import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { SongService } from 'src/songs/domain/song.service';

@Injectable()
export class SongOwnerGuard implements CanActivate {
  constructor(
    private songService: SongService
) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const artistId = request.user.artistId;

    const song = await this.songService.findOne(request.params.id);
    const isOwner = song.artists.find((artist) => artist.id === artistId)
    if (!isOwner) {
        throw new UnauthorizedException("The artist is not one of the creator of the song");
    }

    return true;
  }
}