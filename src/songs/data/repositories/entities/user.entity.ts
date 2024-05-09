import { PlaylistEntity } from "src/playlist/data/repositories/entities";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @OneToMany(() => PlaylistEntity, playlist => playlist.user)
    playlists: PlaylistEntity[];
}