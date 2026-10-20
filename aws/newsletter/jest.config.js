module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['@swc/jest']
  },
  moduleNameMapper: {
    '^@templatical/types$': '<rootDir>/test/mocks/templatical-types.ts',
    '^@templatical/renderer$': '<rootDir>/test/mocks/templatical-renderer.ts',
    '^mjml$': '<rootDir>/test/mocks/mjml.ts',
  },
  setupFilesAfterEnv: ['aws-cdk-lib/testhelpers/jest-autoclean'],
};
