import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity, SongEntity } from ".";

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