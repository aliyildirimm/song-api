import { Controller, Delete, Get, Param, Request} from "@nestjs/common";

import { UserService } from "../domain/user.service";
import { RequestWithUser } from "src/common/guards";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}
    
    @Get(':id')
    async getUserById(@Param("id") id: string) {
        return this.userService.getUserById(+id);
    }

    @Delete()
    async deleteUser(
        @Request() req: RequestWithUser,
    ) {
        return this.userService.deleteUser(req.user.userId);
    }
}