
import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';

import { AuthService } from './auth.service';
import { UserService } from 'src/users/domain/user.service';
import { ArtistService } from 'src/artist/domain/artist.domain';


const mockUserService = mock<UserService>()
const mockArtistService = mock<ArtistService>()
const mockJwtService = mock<JwtService>()

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    service = new AuthService(mockUserService, mockArtistService, mockJwtService)
  });

  it('should throw user not found error', () => {
    expect(service).toBeDefined();
  });
});
