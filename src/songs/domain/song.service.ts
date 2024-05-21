import { Injectable } from '@nestjs/common';

import { SongEntity } from '../data/repositories/entities/song.entity';
import { SongRepository } from '../data/repositories/song.repository';
import { Song } from './models/song.model';

@Injectable()
export class SongService {
  constructor(private readonly repository: SongRepository) {}

  async findAll(): Promise<SongEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<Song | null> {
    return this.repository.findOne(id);
  }

  async findMany(ids: number[]): Promise<SongEntity[]> {
    return this.repository.findMany(ids);
  }

  async create(song: {
    title: string;
    artists: number[];
    duration: number;
    releaseDate: Date;
    lyrics: string;
  }): Promise<SongEntity> {
    return this.repository.create(song);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
