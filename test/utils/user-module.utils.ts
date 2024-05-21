import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';

export const deleteTestAccount = async (app: INestApplication, accessToken: string) => {
    try {
        await request(app.getHttpServer())
          .delete('/users')
          .set('Authorization', `Bearer ${accessToken}`);
      } catch (error) {
        console.error('Error during user deletion, delete manually:', error);
      }
};