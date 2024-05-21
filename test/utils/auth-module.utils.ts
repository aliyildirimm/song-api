import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createTestAccount = async (app: INestApplication) => {
    // Create user
    try {
        await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send({ username: 'test', password: 'password' });
    } catch (error) {
        console.error('Error during sign up:', error);
    }
};

export const signInTestAccount = async (app: INestApplication): Promise<{
  username: string;
  userId: number;
  accessToken: string;
}> => {
    try {
        const response = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({ username: 'test', password: 'password' });       
        return response.body;
      } catch (error) {
        console.error('Error during sign in:', error);
      }
};