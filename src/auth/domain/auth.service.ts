import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/domain/user.service';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/domain/artist.domain';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly artistService: ArtistService,
        private readonly jwtService: JwtService
    ) {}

    async signIn(username: string, password: string): Promise<{ username: string, accessToken: string }> {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new UnauthorizedException('Password is incorrect');
        }


        const artist = await this.artistService.getArtistByUserId(user.id);
        const jwtPayload = {
            username: user.username,
            userId: user.id,
            ...(artist && { artistId: artist.id })
        };

        return {
            username: user.username,
            accessToken: await this.jwtService.signAsync(jwtPayload)
        }
    }

}
