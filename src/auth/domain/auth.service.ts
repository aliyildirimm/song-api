import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/domain/user.service';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
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

        return {
            username: user.username,
            accessToken: await this.jwtService.signAsync({
                username: user.username,
                sub: user.id
            })
        }
    }

}
