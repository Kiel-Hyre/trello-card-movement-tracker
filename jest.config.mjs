export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest', // Use Babel for .js files
  },
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/config/',
    'src/app.js',
    'tests',
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  clearMocks: true,
  verbose: true,
};
