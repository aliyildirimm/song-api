import { User } from "src/users/domain/models/user.model"

export type Artist = {
    id: number,
    name: string,
    user: User,
}