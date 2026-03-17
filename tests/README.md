# Tests

Test suite for the AI Research Guide application.

## Test Structure

```
tests/
├── api/              # API route tests
├── lib/              # Library function tests
├── components/       # Component tests (to be added)
└── integration/      # End-to-end tests (to be added)
```

## Running Tests

```bash
npm test
```

## Test Categories

### Unit Tests
- **Validator**: Input validation logic
- **Parser**: LLM response parsing
- **Utilities**: Helper functions

### API Tests
- **POST /api/plan**: Research plan generation endpoint

### Integration Tests (Future)
- End-to-end user flows
- LLM integration tests
- Knowledge base integrity

## Testing Framework

To be configured with Jest or Vitest.

## Test Coverage Goals

- **Validation logic**: 100%
- **Parsing logic**: 90%+
- **API routes**: 80%+
- **Components**: 70%+

## Adding Tests

When adding new features:
1. Write tests first (TDD approach)
2. Ensure edge cases are covered
3. Mock external dependencies (LLM API)
4. Update this README with new test categories
