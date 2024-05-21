import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { createTestAccount, deleteTestAccount, signInTestAccount } from '../utils';
import { DataSource } from 'typeorm';
import { query } from 'express';

describe('Songs Controller (e2e)', () => {
  let app: INestApplication;
  let userId: number;
  let accessToken: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);

    dataSource = moduleFixture.get<DataSource>(DataSource);

    await createTestAccount(app, { username: 'songs-test', password: 'password' });
   ({userId, accessToken} = await signInTestAccount(app, { username: 'songs-test', password: 'password' }));
  });

  afterAll(async () => {
    await deleteTestAccount(app, accessToken);
    app.close();
  });

  describe('GET /songs', () => {
    beforeAll(async () => {
        await dataSource.query(`INSERT INTO "User" (id, username, password) VALUES (1, 'user1', 'securepassword')`);
        await dataSource.query(`INSERT INTO "Artist" (id, name, "userId") VALUES (1, 'Artist 1', 1)`);
        await dataSource.query(`INSERT INTO "Song" (id, title, releaseDate, duration, lyrics) VALUES (1, 'Song 1', '2021-01-01', 180, 'Lyrics of Song 1')`);
        await dataSource.query(`INSERT INTO "song_artist" (songId, artistId) VALUES (1, 1)`);
        await dataSource.query(`INSERT INTO "Playlist" (id, name, "userId") VALUES (1, 'Playlist 1', 1)`);
        await dataSource.query(`INSERT INTO "song_playlist" (songId, playlistId) VALUES (1, 1)`);
    });

    it('should thorw UnauthorizedException when no token is provided', async () => {
        const result = await request(app.getHttpServer())
            .get('/songs');
        
        expect(result.statusCode).toBe(401);
    });

    it('should return empty array of songs', async () => {
        const result = await request(app.getHttpServer())
            .get('/songs')
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual([]);
    });

    // it('should return array of songs', async () => {
    //     const result = await request(app.getHttpServer())
    //         .get('/songs')
    //         .set('Authorization', `Bearer ${accessToken}`);
        
    //     expect(result.statusCode).toBe(200);
    // });
  });
});
