import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PlaylistEntity } from ".";

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @OneToMany(() => PlaylistEntity, playlist => playlist.user)
    playlists: PlaylistEntity[];
}