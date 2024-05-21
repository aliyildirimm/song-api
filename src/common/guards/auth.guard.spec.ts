import { mock } from "jest-mock-extended";
import { AuthGuard } from "./auth.guard";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { UserService } from "src/users/domain/user.service";
import { UserEntity } from "src/users/data/repository/entitites";

// Mock services and context
const mockUserService = mock<UserService>();
const mockJwtService = mock<JwtService>();
const mockReflector = mock<Reflector>();
const mockContext = mock<ExecutionContext>();
const mockHttpArgumentsHost = mock<HttpArgumentsHost>();

describe('AuthGuard', () => {
    let guard: AuthGuard;

    beforeAll(() => {
        guard = new AuthGuard(mockUserService, mockJwtService, mockReflector);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should allow access to public routes', async () => {
        mockReflector.getAllAndOverride.mockReturnValue(true);
        
        const result = await guard.canActivate(mockContext);

        expect(result).toBe(true);
        expect(mockContext.switchToHttp).not.toHaveBeenCalled();
    });

    it('should deny access when no authorization token is provided', async () => {
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: {} });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException("Token not found"));
    });

    it('should deny access when the JWT has expired', async () => {
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: { authorization: "Bearer providedToken" } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockJwtService.verifyAsync.mockRejectedValue(new TokenExpiredError('ERROR', new Date()));

        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException("Jwt Expired"));
    });

    it('should deny access on JWT verification error', async () => {
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: { authorization: "Bearer providedToken" } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockJwtService.verifyAsync.mockRejectedValue(new Error('ERROR'));

        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException("Error while verifying token"));
    });

    it('should grant access when JWT is valid', async () => {
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: { authorization: "Bearer providedToken" } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockJwtService.verifyAsync.mockResolvedValue({ test: 'test' });
        const mockUser = mock<UserEntity>({
            username: 'test',
        });
        mockUserService.getUserById.mockResolvedValue([mockUser]);

        const result = await guard.canActivate(mockContext);

        expect(result).toBe(true);
        expect(mockContext.switchToHttp().getRequest().user).toEqual({ test: 'test' });
    });
});
