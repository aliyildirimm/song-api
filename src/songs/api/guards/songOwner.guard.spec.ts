import { mock } from "jest-mock-extended";
import { SongOwnerGuard } from "./songOwner.guard";
import { ExecutionContext, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { SongService } from 'src/songs/domain/song.service';
import { Song } from "src/songs/domain/models/song.model";

const mockContext = mock<ExecutionContext>();
const mockHttpArgumentsHost = mock<HttpArgumentsHost>();
const mockSongService = mock<SongService>();

describe('SongOwnerGuard', () => {
    let guard: SongOwnerGuard;

    beforeAll(() => {
        guard = new SongOwnerGuard(mockSongService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should handle exceptions from the song service', async () => {
        // Arrange: Simulate a song service failure
        const songId = 1
        mockHttpArgumentsHost.getRequest.mockReturnValue({ user: { artistId: 1 }, params: { id: songId } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockSongService.findOne.mockRejectedValue(new Error("Database error"));

        // Act & Assert: Ensure the guard gracefully handles service errors
        await expect(guard.canActivate(mockContext)).rejects.toThrow(new InternalServerErrorException("Error whole fetching song"));
    });

    it('should deny access when user is not a song owner', async () => {
        // Arrange
        const songId = 1
        const songMock = mock<Song>({
            id: songId,
            artistIds: [2]
        });
        mockHttpArgumentsHost.getRequest.mockReturnValue({
            user: { artistId: 1 },
            params: { id : songId }
        })
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockSongService.findOne.mockResolvedValue(songMock);

        // Act & Assert
        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException("The artist is not one of the creator of the song"));
    });

    it('should grant access when user is a song owner', async () => {
        // Arrange:
        const songId = 1
        const songMock = mock<Song>({
            id: songId,
            artistIds: [1, 2]
        });
        mockHttpArgumentsHost.getRequest.mockReturnValue({
            user: { artistId: 1 },
            params: { id : songId }
        })
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockSongService.findOne.mockResolvedValue(songMock);

        // Act
        const result = await guard.canActivate(mockContext);

        // Assert
        expect(result).toBe(true);
    });

});
