const { defaults } = require("jest-config");

module.exports = {
  moduleDirectories: ["node_modules"],
  verbose: true,
  runner: "@jest-runner/electron",
  testEnvironment: "@jest-runner/electron/environment",
  moduleNameMapper: {
    "\\.(css.|less|sass|scss)$": "<rootDir>/__mocks__/styleMocks.js",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
  },
  resolver: null,
};
