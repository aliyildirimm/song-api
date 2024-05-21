import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getApp } from '../init-server';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = getApp();
  });

  it('should return 401 when no token is provided', async () => {
    const result = await request(app.getHttpServer())
      .get('/users/12');
    
    expect(result.statusCode).toBe(401);
  });
});
