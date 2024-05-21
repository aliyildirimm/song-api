import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createTestAccount = async (
  app: INestApplication,
  { username, password } : { username: string, password: string }
) => {
    // Create user
    try {
        await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send({ username, password});
    } catch (error) {
        console.error('Error during sign up:', error);
    }
};

export const signInTestAccount = async (
  app: INestApplication,
  { username, password } : { username: string, password: string }
): Promise<{
  username: string;
  userId: number;
  accessToken: string;
}> => {
    try {
        const response = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({ username, password });       
        return response.body;
      } catch (error) {
        console.error('Error during sign in:', error);
      }
};