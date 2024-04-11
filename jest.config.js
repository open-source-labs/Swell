module.exports = {
  verbose: true,
  // runner: "@kayahr/jest-electron-runner/main", // deprecated?
  testEnvironment: 'jsdom',//'@kayahr/jest-electron-runner/environment',
  moduleNameMapper: {
    // "collectCoverage": true,
    electron: '<rootDir>/__mocks__/electronMock.js',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMocks.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '^dexie$': '<rootDir>/node_modules/dexie'
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/__tests__/utils/reduxTestingUtils.tsx',
  ],
  collectCoverage: true,
  coverageDirectory: './test/coverage/jest-coverage',
  coverageReporters: ['json', 'text', 'html'],
  resolver: null,
};
