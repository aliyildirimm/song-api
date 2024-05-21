import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongEntity } from 'src/songs/data/repositories/entities';
import { UserEntity } from 'src/users/data/repository/entitites';

@Entity('Playlist')
export class PlaylistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.playlists)
  user: UserEntity;

  // one song could be in multiple playlists and one playlist could have multiple songs
  @ManyToMany(() => SongEntity, (song) => song.playlists, { cascade: true })
  @JoinTable({ name: 'playlist_song' })
  songs: SongEntity[];
}
