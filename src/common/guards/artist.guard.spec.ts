import { mock } from "jest-mock-extended";
import { ArtistGuard } from "./artist.guard";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";

const mockContext = mock<ExecutionContext>();
const mockHttpArgumentsHost = mock<HttpArgumentsHost>();

describe('ArtistGuard', () => {
    let guard: ArtistGuard;

    beforeAll(() => {
        guard = new ArtistGuard();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should deny access when user is not authenticated', async () => {
        // Arrange
        mockHttpArgumentsHost.getRequest.mockReturnValue({ user: null });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

        // Act & Assert
        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException('User is not authenticated, access denied'));
    });

    it('should deny access when user is not an artist', async () => {
        // Arrange
        mockHttpArgumentsHost.getRequest.mockReturnValue({ user: { artistId: null } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

        // Act & Assert
        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException('User is not an artist, access denied'));
    });

    it('should grant access when user is a valid artist', async () => {
        // Arrange
        mockHttpArgumentsHost.getRequest.mockReturnValue({ user: { artistId: '12345' } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

        // Act
        const result = await guard.canActivate(mockContext);

        // Assert
        expect(result).toBe(true);
    });
});
