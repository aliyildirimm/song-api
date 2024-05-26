import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { AppModule } from 'src/app.module';
import {
  createTestAccount,
  deleteTestAccount,
  signInTestAccount,
} from '../utils';

describe('Songs Controller (e2e)', () => {
  let app: INestApplication;
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

    await createTestAccount(app, {
      username: 'songs-test',
      password: 'password',
    });
    const response = await signInTestAccount(app, {
      username: 'songs-test',
      password: 'password',
    });
    accessToken = response ? response.accessToken : '';
  });

  afterAll(async () => {
    await deleteTestAccount(app, accessToken);
    app.close();
  });

  describe('GET /songs', () => {
    beforeAll(async () => {
      await dataSource.query(
        `INSERT INTO "User" (id, username, password) VALUES (2, 'user2', 'securepassword')`,
      );
      await dataSource.query(
        `INSERT INTO "Artist" (id, name, "userId") VALUES (1, 'Artist 1', 2)`,
      );
      await dataSource.query(
        `INSERT INTO "Song" (id, title, "releaseDate", duration, lyrics) VALUES (1, 'Song 1', '2021-01-01', 180, 'Lyrics of Song 1')`,
      );
      await dataSource.query(
        `INSERT INTO "song_artist" ("songId", "artistId") VALUES (1, 1)`,
      );
      await dataSource.query(
        `INSERT INTO "Playlist" (id, name, "userId") VALUES (1, 'Playlist 1', 2)`,
      );
      await dataSource.query(
        `INSERT INTO "playlist_song" ("songId", "playlistId") VALUES (1, 1)`,
      );
    });

    afterAll(async () => {
      // Delete entries from the join tables first to avoid foreign key constraint errors
      await dataSource.query(
        `DELETE FROM "playlist_song" WHERE "songId" = 1 AND "playlistId" = 1`,
      );
      await dataSource.query(
        `DELETE FROM "song_artist" WHERE "songId" = 1 AND "artistId" = 1`,
      );

      // Then delete entries from the main tables
      await dataSource.query(`DELETE FROM "Playlist" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "Song" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "Artist" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "User" WHERE id = 2`);
    });

    it('should thorw UnauthorizedException when no token is provided', async () => {
      const result = await request(app.getHttpServer()).get('/songs');

      expect(result.statusCode).toBe(401);
    });

    it('should return array of songs', async () => {
      const result = await request(app.getHttpServer())
        .get('/songs')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual([
        {
          id: 1,
          title: 'Song 1',
          releaseDate: '2020-12-31T23:00:00.000Z',
          duration: 180,
          lyrics: 'Lyrics of Song 1',
        },
      ]);
    });
  });

  describe('GET /songs/:id', () => {
    beforeAll(async () => {
      await dataSource.query(
        `INSERT INTO "User" (id, username, password) VALUES (1, 'user1', 'securepassword')`,
      );
      await dataSource.query(
        `INSERT INTO "Artist" (id, name, "userId") VALUES (1, 'Artist 1', 1)`,
      );
      await dataSource.query(
        `INSERT INTO "Song" (id, title, "releaseDate", duration, lyrics) VALUES (1, 'Song 1', '2021-01-01', 180, 'Lyrics of Song 1')`,
      );
      await dataSource.query(
        `INSERT INTO "song_artist" ("songId", "artistId") VALUES (1, 1)`,
      );
      await dataSource.query(
        `INSERT INTO "Playlist" (id, name, "userId") VALUES (1, 'Playlist 1', 1)`,
      );
      await dataSource.query(
        `INSERT INTO "playlist_song" ("songId", "playlistId") VALUES (1, 1)`,
      );
    });

    afterAll(async () => {
      // Delete entries from the join tables first to avoid foreign key constraint errors
      await dataSource.query(
        `DELETE FROM "playlist_song" WHERE "songId" = 1 AND "playlistId" = 1`,
      );
      await dataSource.query(
        `DELETE FROM "song_artist" WHERE "songId" = 1 AND "artistId" = 1`,
      );

      // Then delete entries from the main tables
      await dataSource.query(`DELETE FROM "Playlist" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "Song" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "Artist" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "User" WHERE id = 1`);
    });

    it('should thorw UnauthorizedException when no token is provided', async () => {
      const result = await request(app.getHttpServer()).get('/songs/1');

      expect(result.statusCode).toBe(401);
    });

    it('should return song with given id', async () => {
      const result = await request(app.getHttpServer())
        .get('/songs/1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual({
        id: 1,
        title: 'Song 1',
        releaseDate: '2020-12-31T23:00:00.000Z',
        duration: 180,
        lyrics: 'Lyrics of Song 1',
        artistIds: [1],
      });
    });

    it('should return 404 when song with given id does not exist', async () => {
      const result = await request(app.getHttpServer())
        .get('/songs/2')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(result.statusCode).toBe(404);
    });
  });

  describe('POST /songs', () => {
    beforeAll(async () => {
      await dataSource.query(
        `INSERT INTO "User" (id, username, password) VALUES (1, 'user1', 'securepassword')`,
      );
      await dataSource.query(
        `INSERT INTO "Artist" (id, name, "userId") VALUES (1, 'Artist 1', 1)`,
      );
      await dataSource.query(
        `INSERT INTO "Song" (id, title, "releaseDate", duration, lyrics) VALUES (1, 'Song 1', '2021-01-01', 180, 'Lyrics of Song 1')`,
      );
      await dataSource.query(
        `INSERT INTO "song_artist" ("songId", "artistId") VALUES (1, 1)`,
      );
      await dataSource.query(
        `INSERT INTO "Playlist" (id, name, "userId") VALUES (1, 'Playlist 1', 1)`,
      );
      await dataSource.query(
        `INSERT INTO "playlist_song" ("songId", "playlistId") VALUES (1, 1)`,
      );
    });

    afterAll(async () => {
      // Delete entries from the join tables first to avoid foreign key constraint errors
      await dataSource.query(
        `DELETE FROM "playlist_song" WHERE "songId" = 1 AND "playlistId" = 1`,
      );
      await dataSource.query(
        `DELETE FROM "song_artist" WHERE "songId" = 1 AND "artistId" = 1`,
      );

      // Then delete entries from the main tables
      await dataSource.query(`DELETE FROM "Playlist" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "Song" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "Artist" WHERE id = 1`);
      await dataSource.query(`DELETE FROM "User" WHERE id = 1`);
    });

    it('should thorw UnauthorizedException when no token is provided', async () => {
      const result = await request(app.getHttpServer())
        .post('/songs')
        .send({
          title: 'Song 2',
          releaseDate: '2021-01-01',
          duration: 180,
          lyrics: 'Lyrics of Song 2',
          artistIds: [1],
        });

      expect(result.statusCode).toBe(401);
    });

    it('should throw UnauthorizedException when the user is not an artist', async () => {
      const result = await request(app.getHttpServer())
        .post('/songs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Song 2',
          releaseDate: '2021-01-01',
          duration: 180,
          lyrics: 'Lyrics of Song 2',
          artistIds: [2],
        });

      expect(result.statusCode).toBe(401);
      expect(result.body.message).toBe('User is not an artist, access denied');
    });

    // you should create an artist user and then try to call create a song in the database for this.
  });
});
