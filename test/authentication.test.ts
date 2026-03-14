import { Request, Response } from "express";
import authenticate from "src/api/v1/middleware/authenticate";
import { auth } from "src/api/v1/config/firebaseConfig";
import { AuthenticationError } from "src/api/v1/errors/errors";

// Mock the Firebase config module
jest.mock("src/api/v1/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("Authentication Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        // Reset mocks between tests
        jest.clearAllMocks();

        // Set up basic mock objects
        mockRequest = {
            headers: {},
        };

        mockResponse = {
            locals: {},
        };

        nextFunction = jest.fn();
    });

    it("should call next() with AuthenticationError when no token is provided", async () => {
        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
        const error = nextFunction.mock.calls[0][0] as AuthenticationError;
        expect(error.message).toContain("Unauthorized: No token provided");
        expect(error.code).toBe("TOKEN_NOT_FOUND");
    });

    it("should call next() with AuthenticationError when token is invalid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };

        // Mock the Firebase auth response
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("Firebase Error: Invalid token")
        );

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith("invalid-token");
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
        const error = nextFunction.mock.calls[0][0] as AuthenticationError;
        expect(error.message).toContain("Unauthorized: ");
    });

    it("should call next() with AuthenticationError when authorization header is malformed", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Token invalid-format",
        };

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
        const error = nextFunction.mock.calls[0][0] as AuthenticationError;
        expect(error.message).toContain("Unauthorized: No token provided");
        expect(error.code).toBe("TOKEN_NOT_FOUND");
    });

    it("should set undefined role when decoded token has no role", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        const mockDecodedToken = {
            uid: "user123",
        } as any;

        // Mock successful token verification
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce(
            mockDecodedToken
        );

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(mockResponse.locals).toEqual({
            uid: "user123",
            role: undefined,
        });
        expect(nextFunction).toHaveBeenCalled();
    });

    it("should call next() and set user data when token is valid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        const mockDecodedToken = {
            uid: "user123",
            role: "admin",
        };

        // Mock successful token verification
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce(
            mockDecodedToken
        );

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(mockResponse.locals).toEqual({
            uid: "user123",
            role: "admin",
        });
        expect(nextFunction).toHaveBeenCalled();
    });
});