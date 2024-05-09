import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArtistEntity } from "./.";
import { PlaylistEntity } from "src/playlist/data/repositories/entities";

@Entity("Song")
export class SongEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    releaseDate: Date;
    
    @Column()
    duration: number;
    
    @Column()
    lyrics: string;

    @ManyToMany(() => ArtistEntity, artist => artist.songs, { cascade: true })
    @JoinTable({ name: 'song_artist' })
    artists: ArtistEntity[];

    @ManyToMany(() => PlaylistEntity, playlist => playlist.songs)
    playlists: PlaylistEntity[];
}