import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Songs")
export class SongEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column('varchar', { array: true })
    artists: string[];
    
    @Column()
    releaseDate: Date;
    
    @Column()
    duration: number;
    
    @Column()
    lyrics: string;
}