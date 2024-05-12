import { Artist } from "src/artist/domain/models/artist.model";
import { ArtistEntity } from "../entities/artist.entity";

export const mapArtistEntityToArtistModel = (artistEntity: ArtistEntity): Artist => ({
    id: artistEntity.id,
    name: artistEntity.name,
    user: artistEntity.user,
})
