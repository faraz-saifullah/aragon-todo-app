# Test Suite

This project includes backend tests to demonstrate testing capability and ensure code quality.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

Current coverage focuses on critical backend components:

### API Route Tests (`__tests__/api/boards.test.ts`)

- **POST /api/boards** - Create board with valid data (happy path)
- **POST /api/boards** - Validation error handling (empty title)
- **POST /api/boards** - Validation error handling (title too long)
- **GET /api/boards** - Retrieve all boards
- **Coverage**: 93.33% of boards API route

### Service Layer Tests (`__tests__/services/board.service.test.ts`)

- **createBoard()** - Successful board creation
- **createBoard()** - Database error handling
- **getAllBoards()** - Retrieve and sort boards
- **getBoardById()** - Retrieve board with tasks
- **getBoardById()** - Handle non-existent board
- **Coverage**: 81.81% of board service

## Test Statistics

- **Total Tests**: 9
- **Status**: ✅ All passing
- **Test Suites**: 2
- **Demonstrates**: API testing, service layer testing, validation, error handling, mocking

## Why This Coverage?

Given the 2.5-hour assignment constraint, this test suite demonstrates:

1. Understanding of testing patterns (arrange/act/assert)
2. Both happy path and error case testing
3. Multiple layers (API + service)
4. Proper mocking and isolation
5. Validation and error handling

For production, coverage would expand to:

- All CRUD endpoints (tasks routes)
- All service methods
- Integration tests with test database
- Component tests for UI
- Target: 70-80% overall coverage
