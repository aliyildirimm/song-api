import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateSongDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    readonly artists: string[];

    @IsNotEmpty()
    @IsDateString()
    readonly releaseDate: Date;

    @IsNotEmpty()
    readonly duration: number;
}