import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  readonly artists: number[];

  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: Date;

  @IsNotEmpty()
  readonly duration: number;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
