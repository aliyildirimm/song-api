import { Module } from "@nestjs/common";
import { ArtistService } from "./domain/artist.domain";
import { ArtistRepository } from "./data/repositories/artist.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistEntity } from "./data/repositories/entities/artist.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ArtistEntity])],
    providers: [ArtistService, ArtistRepository],
    exports: [ArtistService]
})
export class ArtistModule {}