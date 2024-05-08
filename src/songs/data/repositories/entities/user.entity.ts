import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
}