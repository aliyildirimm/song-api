import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArtistEntity } from './entities';
import { mapArtistEntityToArtistModel } from './mappers/artistEntity.mapper';
import { Artist } from 'src/artist/domain/models';

@Injectable()
export class ArtistRepository {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly repository: Repository<ArtistEntity>,
  ) {}
  async getArtists(ids: number[]): Promise<Artist[]> {
    const result = await this.repository.findBy(
      ids.map((artistId) => ({ id: artistId })),
    );

    return result.map(mapArtistEntityToArtistModel);
  }

  async getArtistByUserId(userId: number): Promise<Artist | null> {
    const result = await this.repository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return result ? mapArtistEntityToArtistModel(result) : null;
  }
}
