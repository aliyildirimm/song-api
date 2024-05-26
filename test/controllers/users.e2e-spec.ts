import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createTestAccount,
  deleteTestAccount,
  signInTestAccount,
} from '../utils';
import { AppModule } from 'src/app.module';
import { Test, TestingModule } from '@nestjs/testing';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let userId: number;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);
    await createTestAccount(app, {
      username: 'users-test',
      password: 'password',
    });
    const response = await signInTestAccount(app, {
      username: 'users-test',
      password: 'password',
    });
    if (!response) {
      throw new Error('Should not happen');
    }
    ({ userId, accessToken } = response);
  });

  afterAll(async () => {
    await deleteTestAccount(app, accessToken);
    app.close();
  });

  describe('GET /users/:id', () => {
    it('should return 401 when no token is provided', async () => {
      const result = await request(app.getHttpServer()).get('/users/12');

      expect(result.statusCode).toBe(401);
    });

    it('should return user details when provided valid token and user id', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(result.body[0]).toEqual({
        id: userId,
        username: 'users-test',
      });
      expect(result.statusCode).toBe(200);
    });
  });

  describe('DELETE /users', () => {
    it('should return 401 when no token is provided', async () => {
      const result = await request(app.getHttpServer()).delete('/users');

      expect(result.statusCode).toBe(401);
    });

    it('should delete the user when provided valid token', async () => {
      const result = await request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', `Bearer ${accessToken}`);

      const deletedUser = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(deletedUser.statusCode).toBe(401);
      expect(result.statusCode).toBe(200);
    });
  });
});
