import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { Song } from 'src/songs/domain/models/song.model';
import { SongService } from 'src/songs/domain/song.service';

@Injectable()
export class SongOwnerGuard implements CanActivate {
  constructor(private songService: SongService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const artistId = request.user.artistId;

    let song: Song;
    try {
      song = await this.songService.findOne(request.params.id);
    } catch (error: unknown) {
      throw new InternalServerErrorException("Error whole fetching song")
    }
  
    const isOwner = song.artistIds.includes(artistId)
    if (!isOwner) {
      throw new UnauthorizedException("The artist is not one of the creator of the song");
    }

    return true;
  }
}