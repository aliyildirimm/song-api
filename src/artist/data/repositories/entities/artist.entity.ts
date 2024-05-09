import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/users/data/repository/entitites";
import { SongEntity } from "src/songs/data/repositories/entities";

@Entity("Artist")
export class ArtistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @ManyToMany(() => SongEntity, song => song.artists)
    songs: SongEntity[];
}