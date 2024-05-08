import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
    private readonly dbHost = process.env.DB_HOST;
    constructor() {
        console.log(this.dbHost);
    }
}