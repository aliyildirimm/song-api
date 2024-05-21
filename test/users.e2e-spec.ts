import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);

    // Create user
    try {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ username: 'test', password: 'password' });
    } catch (error) {
      console.error('Error during sign up:', error);
    }
    
    // Login user
    try {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ username: 'test', password: 'password' });       
      accessToken = response.body.accessToken;
    } catch (error) {
      console.error('Error during sign in:', error);
    }

  });

  afterAll(async () => {
    try {
      await request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', `Bearer ${accessToken}`);
    } catch (error) {
      console.error('Error during user deletion, delete manually:', error);
    }
    app.close();
  })
  it('should return 401 when no token is provided', async () => {
    const result = await request(app.getHttpServer())
      .get('/users/12');
    
    expect(result.statusCode).toBe(401);
  });
});
