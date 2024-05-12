import { mock } from "jest-mock-extended";
import { AuthGuard } from "./auth.guard";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";

// Mock services and context
const mockJwtService = mock<JwtService>();
const mockReflector = mock<Reflector>();
const mockContext = mock<ExecutionContext>();
const mockHttpArgumentsHost = mock<HttpArgumentsHost>();

describe('AuthGuard', () => {
    let guard: AuthGuard;

    beforeAll(() => {
        // Initialize the AuthGuard with mocked dependencies
        guard = new AuthGuard(mockJwtService, mockReflector);
    });

    afterEach(() => {
        // Reset all mocks after each test to ensure test isolation
        jest.resetAllMocks();
    });

    it('should allow access to public routes', async () => {
        // Arrange: Setup Reflector to treat the route as public
        mockReflector.getAllAndOverride.mockReturnValue(true);
        
        // Act: Attempt to activate the guard
        const result = await guard.canActivate(mockContext);

        // Assert: Verify the guard grants access and does not need HTTP context
        expect(result).toBe(true);
        expect(mockContext.switchToHttp).not.toHaveBeenCalled();
    });

    it('should deny access when no authorization token is provided', async () => {
        // Arrange: Simulate an HTTP request with no authorization header
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: {} });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

        // Act & Assert: Expect an UnauthorizedException due to missing token
        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException("Token not found"));
    });

    it('should deny access when the JWT has expired', async () => {
        // Arrange: Simulate a request with an expired JWT
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: { authorization: "Bearer providedToken" } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockJwtService.verifyAsync.mockRejectedValue(new TokenExpiredError('ERROR', new Date()));

        // Act & Assert: Expect an UnauthorizedException for an expired JWT
        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException("Jwt Expired"));
    });

    it('should deny access on JWT verification error', async () => {
        // Arrange: Simulate a request where JWT verification fails
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: { authorization: "Bearer providedToken" } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockJwtService.verifyAsync.mockRejectedValue(new Error('ERROR'));

        // Act & Assert: Expect an UnauthorizedException due to verification error
        await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException("Error while verifying token"));
    });

    it('should grant access when JWT is valid', async () => {
        // Arrange: Simulate a valid JWT in the request
        mockHttpArgumentsHost.getRequest.mockReturnValue({ headers: { authorization: "Bearer providedToken" } });
        mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
        mockJwtService.verifyAsync.mockResolvedValue({ test: 'test' });

        // Act: Attempt to activate the guard
        const result = await guard.canActivate(mockContext);

        // Assert: Verify the guard grants access and the user is correctly set
        expect(result).toBe(true);
        expect(mockContext.switchToHttp().getRequest().user).toEqual({ test: 'test' });
    });
});
