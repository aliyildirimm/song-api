import { Controller, Get, Inject, Param } from "@nestjs/common";
import { UserService } from "../domain/user.service";

@Controller('users')
export class UsersController {
    constructor(@Inject(UserService) private readonly userService: UserService) {}
    
    @Get(':id')
    async getUserById(
        @Param("id") id: string
    ) {
        console.log('id', id);
        return this.userService.getUserById(+id);
    }
}