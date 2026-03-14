import { Request, Response } from "express";
import isAuthorized from "src/api/v1/middleware/authorize";
import { AuthorizationError } from "src/api/v1/errors/errors";
import { AuthorizationOptions } from "src/api/v1/models/authorizationOptions";

describe("Authorization Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        // Reset for each test
        mockRequest = {
            params: {},
        };

        mockResponse = {
            locals: {},
        };

        nextFunction = jest.fn();
    });

    it("should call next() when user has required role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "admin",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin", "manager"],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should call next() with AuthorizationError when role is missing", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthorizationError));
        const error = nextFunction.mock.calls[0][0] as AuthorizationError;
        expect(error.code).toBe("ROLE_NOT_FOUND");
        expect(error.message).toContain("Forbidden");
    });

    it("should call next() with AuthorizationError when user has insufficient role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "user",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthorizationError));
        const error = nextFunction.mock.calls[0][0] as AuthorizationError;
        expect(error.code).toBe("INSUFFICIENT_ROLE");
        expect(error.message).toContain("Forbidden");
    });

    it("should call next() when allowSameUser is true and IDs match", () => {
        // Arrange
        const userId = "user123";

        mockRequest.params = {
            id: userId,
        };

        mockResponse.locals = {
            uid: userId,
            role: "user",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"],
            allowSameUser: true,
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(nextFunction).toHaveBeenCalledWith();
    });
});