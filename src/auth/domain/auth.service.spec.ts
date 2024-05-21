import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserService } from 'src/users/domain/user.service';
import { ArtistService } from 'src/artist/domain/artist.service';
import { User } from 'src/users/domain/models/user.model';
import { Artist } from 'src/artist/domain/models/artist.model';

jest.mock('bcrypt');

const mockUserService = mock<UserService>();
const mockArtistService = mock<ArtistService>();
const mockJwtService = mock<JwtService>();

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    service = new AuthService(
      mockUserService,
      mockArtistService,
      mockJwtService,
    );
  });

  describe('SignIn', () => {
    const username = 'test';
    const password = 'password';
    it('should throw user not found error', () => {
      mockUserService.getUserByUsername.mockResolvedValue(null);

      expect(service.signIn(username, password)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });

    it('should throw password is incorrect error', () => {
      const mockUser = mock<User>({
        id: 1,
        username: 'test',
        password: 'different-password',
      });
      mockUserService.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(() => false);

      expect(service.signIn(username, password)).rejects.toThrow(
        new UnauthorizedException('Password is incorrect'),
      );
    });

    it('should return accesstoken with username not including artistId in the payload', async () => {
      const mockUser = mock<User>({
        id: 1,
        username: 'test',
        password: 'password',
      });

      mockUserService.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(() => true);
      mockJwtService.signAsync.mockResolvedValue('accessToken');
      mockArtistService.getArtistByUserId.mockResolvedValue(null);

      const result = await service.signIn(username, password);

      expect(mockArtistService.getArtistByUserId).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        username: 'test',
        userId: 1,
      });
      expect(result).toEqual({
        username: 'test',
        accessToken: 'accessToken',
      });
    });

    it('should return accesstoken with username including artistId in the payload', async () => {
      const mockUser = mock<User>({
        id: 1,
        username: 'test',
        password: 'password',
      });

      mockUserService.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(() => true);
      mockJwtService.signAsync.mockResolvedValue('accessToken');

      const mockArtist = mock<Artist>({
        id: 11,
        name: 'test',
        user: mockUser,
      });
      mockArtistService.getArtistByUserId.mockResolvedValue(mockArtist);

      const result = await service.signIn(username, password);

      expect(mockArtistService.getArtistByUserId).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        username: 'test',
        userId: 1,
        artistId: 11,
      });
      expect(result).toEqual({
        username: 'test',
        accessToken: 'accessToken',
      });
    });
  });
});
