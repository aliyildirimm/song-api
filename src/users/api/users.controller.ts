import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../domain/user.service";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}
    
    @Get(':id')
    async getUserById(@Param("id") id: string) {
        return this.userService.getUserById(+id);
    }
}