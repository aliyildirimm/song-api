import { Injectable } from '@nestjs/common';

import { ArtistRepository } from '../data/repositories/artist.repository';
import { Artist } from './models';

@Injectable()
export class ArtistService {
  constructor(private artistRepository: ArtistRepository) {}
  getArtists(ids: number[]): Promise<Artist[]> {
    return this.artistRepository.getArtists(ids);
  }

  getArtistByUserId(userId: number): Promise<Artist | null> {
    return this.artistRepository.getArtistByUserId(userId);
  }
}
