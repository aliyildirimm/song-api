import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { createTestAccount, deleteTestAccount, signInTestAccount } from "./utils";

let app: INestApplication;
let userId: number;
let accessToken: string;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);
    await createTestAccount(app);
  
    const signInResult = await signInTestAccount(app);
    userId = signInResult.userId;
    accessToken = signInResult.accessToken;
});

afterAll(async () => {
    await deleteTestAccount(app, accessToken);
    app.close();
  });

export const getApp = () => app;
export const getUserIdAndAccessToken = () => ({
    userId,
    accessToken
});