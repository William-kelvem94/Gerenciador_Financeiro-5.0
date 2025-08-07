// 🧪 Jest Configuration - Will Finance 5.0
// Comprehensive testing setup with coverage and performance monitoring

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // =====================================================
  // 📁 Test Files and Directories
  // =====================================================
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  
  // =====================================================
  // 📊 Coverage Configuration
  // =====================================================
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.enum.ts',
    '!src/index.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/services/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/controllers/': {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  
  // =====================================================
  // 🔧 Setup and Teardown
  // =====================================================
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts'
  ],
  globalSetup: '<rootDir>/test/globalSetup.ts',
  globalTeardown: '<rootDir>/test/globalTeardown.ts',
  
  // =====================================================
  // 🌐 Module Resolution
  // =====================================================
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // =====================================================
  // ⚡ Performance and Behavior
  // =====================================================
  testTimeout: 10000,
  maxWorkers: '50%',
  cache: true,
  bail: false,
  verbose: true,
  
  // =====================================================
  // 🎯 Test Categories
  // =====================================================
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}']
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/test/integration/**/*.test.{ts,tsx}']
    },
    {
      displayName: 'api',
      testMatch: ['<rootDir>/test/api/**/*.test.{ts,tsx}']
    }
  ],
  
  // =====================================================
  // 📝 Reporting
  // =====================================================
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'report.html',
        expand: true
      }
    ],
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml'
      }
    ]
  ],
  
  // =====================================================
  // 🔄 Watch Mode
  // =====================================================
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],
  
  // =====================================================
  // 🚫 Ignore Patterns
  // =====================================================
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],
  
  // =====================================================
  // 🎭 Mocks and Stubs
  // =====================================================
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
};