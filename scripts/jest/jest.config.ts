import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    roots: ['<rootDir>/../../src'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/../../src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/jestSetup.ts'],
    collectCoverageFrom: [
        '**/**/*.{ts,tsx}',
        '!**/**/*.test.{ts,tsx}',
        '!**/src/types/**',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/__tests__/**',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageReporters: [
        'text',
        'lcov',
        'html'
    ]
};

export default config;
