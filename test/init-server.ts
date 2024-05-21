import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { createTestAccount, deleteTestAccount, signInTestAccount } from "./utils";

let app: INestApplication;
let accessToken: string;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);
    await createTestAccount(app);
    accessToken = await signInTestAccount(app);
});

afterAll(async () => {
    await deleteTestAccount(app, accessToken);
    app.close();
  });

export const getApp = () => app;
export const getAccessToken = () => accessToken;