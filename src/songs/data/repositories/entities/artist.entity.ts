import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SongEntity } from ".";
import { UserEntity } from "src/users/data/repository/entitites";

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