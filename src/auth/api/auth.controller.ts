import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

import { UserService } from 'src/users/domain/user.service';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from '../domain/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('/sign-up')
    async signUp(
        @Body() body: SignUpDto
    ) {
        const user = await this.userService.createUser(body.username, body.password);
        return user;
    }

    @Post('/sign-in')
    @HttpCode(200)
    async signIn(
        @Body() body: SignInDto
    ) {
        return this.authService.signIn(body.username, body.password);
    }
}
