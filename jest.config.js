
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/server.ts",
        "!src/types/**/*.ts",
    ],
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1"
    }
};
