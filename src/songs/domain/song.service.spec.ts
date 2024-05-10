import { SongService } from './song.service';
import { mock } from 'jest-mock-extended';
import { SongRepository } from '../data/repositories/song.repository';

const mockSongRepository = mock<SongRepository>();

describe('SongsService', () => {
  let service: SongService;

  beforeEach(async () => {
    service = new SongService(mockSongRepository)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
