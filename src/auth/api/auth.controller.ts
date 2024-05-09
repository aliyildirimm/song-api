import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { UserService } from 'src/users/domain/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(UserService) private readonly userService: UserService
    ) {}

    @Post('/sign-up')
    async signUp(
        @Body() body: SignUpDto
    ) {
        const user = await this.userService.createUser(body.username, body.password);
        return user;
    }
}
