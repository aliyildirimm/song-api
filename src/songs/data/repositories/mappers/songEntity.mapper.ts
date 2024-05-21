import { Song } from 'src/songs/domain/models/song.model';
import { SongEntity } from '../entities';

export const mapSongEntityToSongModel = (songEntity: SongEntity): Song => ({
  id: songEntity.id,
  title: songEntity.title,
  releaseDate: songEntity.releaseDate,
  duration: songEntity.duration,
  lyrics: songEntity.lyrics,
  artistIds: songEntity.artists.map((artist) => artist.id),
});
