import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SongEntity } from './entities';
import { ArtistEntity } from 'src/artist/data/repositories/entities/artist.entity';
import { mapSongEntityToSongModel } from './mappers/songEntity.mapper';
import { Song } from 'src/songs/domain/models/song.model';

@Injectable()
export class SongRepository {
  // NOTE: @InjectRepository() and TypeormModule.forFeature() have to work together because
  // Typescript cannot reflect generics properly. Normally with Nest we can use class names as
  // injection tokens, but something like Repository<TaskEntity> just comes back as Repository
  // so Nest wouldn't know which repository to inject. By using the @InjectRepository() decorator
  // we are able to set the injection token metadata and override the reflected class value.
  constructor(
    @InjectRepository(SongEntity)
    private readonly songRepository: Repository<SongEntity>,
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
  ) {}

  async findAll(): Promise<SongEntity[]> {
    return await this.songRepository.find();
  }

  async findOne(id: string): Promise<Song | null> {
    const result = await this.songRepository.findOne({
      where: { id: +id },
      relations: ['artists'],
    });

    return result ? mapSongEntityToSongModel(result) : null;
  }

  findMany(ids: number[]): Promise<SongEntity[]> {
    return this.songRepository.findBy(ids.map((id) => ({ id })));
  }

  async create(song: {
    title: string;
    artists: number[];
    duration: number;
    releaseDate: Date;
    lyrics?: string;
  }): Promise<SongEntity> {
    const songEntity = new SongEntity();
    songEntity.title = song.title;
    songEntity.duration = song.duration;
    songEntity.releaseDate = song.releaseDate;
    songEntity.lyrics = song.lyrics ?? '';

    const artists = await this.artistRepository.findBy(
      song.artists.map((id) => ({ id })),
    );
    if (artists.length !== song.artists.length) {
      throw new InternalServerErrorException('Some artists were not found');
    }

    songEntity.artists = artists;
    return await this.songRepository.save(songEntity);
  }

  async delete(id: string): Promise<void> {
    await this.songRepository.delete({ id: +id });
  }
}
