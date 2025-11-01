# Test Coverage - Automated Test Generation

Analyze test coverage and generate missing tests to achieve 80% minimum coverage.

## Phase 1: Coverage Analysis

**Running coverage analysis...**

I'll execute your project's test runner with coverage:

```bash
# For Jest
npm test -- --coverage

# For Vitest
npm test -- --coverage

# For Pytest
pytest --cov=src --cov-report=term --cov-report=html

# For Go
go test -coverprofile=coverage.out ./...
```

## Coverage Report

### Overall Metrics

```
Test Coverage Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Coverage: 62.5% 🟡 (Target: 80%)

By Category:
├─ Statements: 65.2% (1,234 / 1,893)
├─ Branches:   58.7% (234 / 398)
├─ Functions:  71.3% (142 / 199)
└─ Lines:      64.8% (1,189 / 1,834)

Status: ⚠️ Below target (-17.5%)
```

### Files by Coverage

```
Critical Files (Need Tests) 🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/services/paymentService.ts       12.5%  ████░░░░░░░░░░░░
src/services/authService.ts          34.2%  ████████░░░░░░░░
src/controllers/orderController.ts   45.8%  ███████████░░░░░

Moderate Coverage (Improve) 🟡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/services/userService.ts          67.3%  ████████████████░░
src/services/emailService.ts         71.2%  █████████████████░
src/utils/validators.ts               68.9%  ████████████████░░

Good Coverage (Maintain) ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/utils/formatters.ts               89.4%  ██████████████████
src/config/database.ts                92.1%  ██████████████████
src/middleware/auth.ts                85.7%  █████████████████░
```

## Phase 2: Identify Untested Code

### Uncovered Lines Analysis

For each file below target, I'll identify:

**src/services/paymentService.ts (12.5% coverage)**

```typescript
Uncovered Code Paths:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lines 45-67: processRefund function
├─ No tests for successful refunds
├─ No tests for failed refunds
├─ No tests for partial refunds
└─ No tests for duplicate refund attempts

Lines 89-112: validatePaymentMethod function
├─ No tests for expired cards
├─ No tests for insufficient funds
├─ No tests for invalid CVV
└─ No tests for blacklisted cards

Lines 145-178: handlePaymentWebhook function
├─ No tests for successful payment webhook
├─ No tests for failed payment webhook
├─ No tests for webhook signature validation
└─ No tests for duplicate webhooks

Critical Business Logic: 🔴 HIGH PRIORITY
Error Handling: 🔴 HIGH PRIORITY
Edge Cases: 🟡 MEDIUM PRIORITY
```

## Phase 3: Test Generation

For each uncovered code path, I'll generate comprehensive tests:

### Example: Payment Service Tests

```typescript
// tests/services/paymentService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaymentService } from '@/services/paymentService';
import { PaymentProvider } from '@/providers/paymentProvider';
import { NotFoundError, PaymentError } from '@/errors';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockPaymentProvider: jest.Mocked<PaymentProvider>;

  beforeEach(() => {
    mockPaymentProvider = {
      processRefund: vi.fn(),
      validateCard: vi.fn(),
      processPayment: vi.fn(),
    } as any;

    paymentService = new PaymentService(mockPaymentProvider);
  });

  describe('processRefund', () => {
    it('should successfully process a full refund', async () => {
      // Arrange
      const orderId = 'order-123';
      const amount = 100.0;
      mockPaymentProvider.processRefund.mockResolvedValue({
        refundId: 'refund-456',
        status: 'completed',
        amount,
      });

      // Act
      const result = await paymentService.processRefund(orderId, amount);

      // Assert
      expect(result).toEqual({
        refundId: 'refund-456',
        status: 'completed',
        amount: 100.0,
      });
      expect(mockPaymentProvider.processRefund).toHaveBeenCalledWith({
        orderId,
        amount,
      });
    });

    it('should successfully process a partial refund', async () => {
      // Arrange
      const orderId = 'order-123';
      const originalAmount = 100.0;
      const refundAmount = 50.0;
      mockPaymentProvider.processRefund.mockResolvedValue({
        refundId: 'refund-789',
        status: 'completed',
        amount: refundAmount,
      });

      // Act
      const result = await paymentService.processRefund(
        orderId,
        refundAmount
      );

      // Assert
      expect(result.amount).toBe(refundAmount);
      expect(result.status).toBe('completed');
    });

    it('should throw PaymentError when refund fails', async () => {
      // Arrange
      const orderId = 'order-123';
      const amount = 100.0;
      mockPaymentProvider.processRefund.mockRejectedValue(
        new Error('Insufficient funds')
      );

      // Act & Assert
      await expect(
        paymentService.processRefund(orderId, amount)
      ).rejects.toThrow(PaymentError);
    });

    it('should prevent duplicate refund attempts', async () => {
      // Arrange
      const orderId = 'order-123';
      const amount = 100.0;

      // First refund succeeds
      mockPaymentProvider.processRefund.mockResolvedValueOnce({
        refundId: 'refund-456',
        status: 'completed',
        amount,
      });

      // Second refund for same order should fail
      mockPaymentProvider.processRefund.mockRejectedValueOnce(
        new Error('Already refunded')
      );

      // Act
      await paymentService.processRefund(orderId, amount);

      // Assert
      await expect(
        paymentService.processRefund(orderId, amount)
      ).rejects.toThrow('Already refunded');
    });

    it('should handle refund amount exceeding original payment', async () => {
      // Arrange
      const orderId = 'order-123';
      const originalAmount = 100.0;
      const excessiveRefundAmount = 150.0;

      // Act & Assert
      await expect(
        paymentService.processRefund(orderId, excessiveRefundAmount)
      ).rejects.toThrow('Refund amount exceeds original payment');
    });
  });

  describe('validatePaymentMethod', () => {
    it('should validate a valid credit card', async () => {
      // Arrange
      const card = {
        number: '4111111111111111',
        expMonth: 12,
        expYear: 2025,
        cvv: '123',
      };
      mockPaymentProvider.validateCard.mockResolvedValue(true);

      // Act
      const result = await paymentService.validatePaymentMethod(card);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject expired card', async () => {
      // Arrange
      const expiredCard = {
        number: '4111111111111111',
        expMonth: 1,
        expYear: 2020,
        cvv: '123',
      };

      // Act
      const result = await paymentService.validatePaymentMethod(expiredCard);

      // Assert
      expect(result).toBe(false);
    });

    it('should reject invalid CVV', async () => {
      // Arrange
      const invalidCvvCard = {
        number: '4111111111111111',
        expMonth: 12,
        expYear: 2025,
        cvv: '12', // Too short
      };

      // Act
      const result = await paymentService.validatePaymentMethod(
        invalidCvvCard
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should reject blacklisted card', async () => {
      // Arrange
      const blacklistedCard = {
        number: '4000000000000002', // Known test card for fraud
        expMonth: 12,
        expYear: 2025,
        cvv: '123',
      };
      mockPaymentProvider.validateCard.mockResolvedValue(false);

      // Act
      const result = await paymentService.validatePaymentMethod(
        blacklistedCard
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('handlePaymentWebhook', () => {
    it('should process successful payment webhook', async () => {
      // Arrange
      const webhook = {
        type: 'payment.succeeded',
        data: {
          orderId: 'order-123',
          amount: 100.0,
          paymentId: 'pay-456',
        },
        signature: 'valid-signature',
      };

      // Act
      await paymentService.handlePaymentWebhook(webhook);

      // Assert
      // Verify order was updated
      // Verify email was sent
      // Verify inventory was reserved
    });

    it('should validate webhook signature', async () => {
      // Arrange
      const webhookWithInvalidSignature = {
        type: 'payment.succeeded',
        data: { orderId: 'order-123' },
        signature: 'invalid-signature',
      };

      // Act & Assert
      await expect(
        paymentService.handlePaymentWebhook(webhookWithInvalidSignature)
      ).rejects.toThrow('Invalid webhook signature');
    });

    it('should handle duplicate webhook events', async () => {
      // Arrange
      const webhook = {
        type: 'payment.succeeded',
        data: { orderId: 'order-123' },
        signature: 'valid-signature',
        eventId: 'evt-789',
      };

      // Act - Process same webhook twice
      await paymentService.handlePaymentWebhook(webhook);
      await paymentService.handlePaymentWebhook(webhook);

      // Assert - Should only process once
      // Verify idempotency
    });
  });
});
```

## Test Categories

I'll generate tests for:

### 1. Happy Path Tests ✅
**Expected behavior with valid inputs**

```typescript
it('should create user with valid data', async () => {
  const user = await userService.create({
    email: 'user@example.com',
    password: 'SecurePass123',
  });

  expect(user).toHaveProperty('id');
  expect(user.email).toBe('user@example.com');
});
```

### 2. Error Condition Tests 🔴
**Handling of invalid inputs and failures**

```typescript
it('should throw ValidationError for invalid email', async () => {
  await expect(
    userService.create({
      email: 'invalid-email',
      password: 'SecurePass123',
    })
  ).rejects.toThrow(ValidationError);
});

it('should handle database connection failure', async () => {
  mockDb.connect.mockRejectedValue(new Error('Connection failed'));

  await expect(userService.getAll()).rejects.toThrow('Connection failed');
});
```

### 3. Edge Case Tests ⚠️
**Boundary conditions and unusual scenarios**

```typescript
it('should handle empty array input', () => {
  const result = processItems([]);
  expect(result).toEqual([]);
});

it('should handle very large numbers', () => {
  const result = calculate(Number.MAX_SAFE_INTEGER);
  expect(result).toBeDefined();
});

it('should handle concurrent requests', async () => {
  const promises = Array(100)
    .fill(null)
    .map(() => service.process());

  const results = await Promise.all(promises);
  expect(results).toHaveLength(100);
});
```

### 4. Integration Tests 🔗
**Component interactions**

```typescript
describe('User Registration Flow', () => {
  it('should complete full registration process', async () => {
    // Create user
    const user = await authService.register({
      email: 'new@example.com',
      password: 'Pass123',
    });

    // Verify email sent
    expect(emailService.send).toHaveBeenCalledWith(
      'new@example.com',
      expect.stringContaining('verify')
    );

    // Verify token created
    const token = await tokenService.findByUserId(user.id);
    expect(token).toBeDefined();
  });
});
```

### 5. Mock/Stub Tests 🎭
**External dependencies**

```typescript
it('should call external API with correct parameters', async () => {
  mockApiClient.post.mockResolvedValue({ data: { success: true } });

  await service.syncData();

  expect(mockApiClient.post).toHaveBeenCalledWith('/sync', {
    timestamp: expect.any(Number),
    data: expect.any(Array),
  });
});
```

## Test Coverage Goals

### Priority Levels

**Critical (Must have 90%+)** 🔴
- Payment processing
- Authentication/authorization
- Data persistence
- Security-sensitive operations

**High (Must have 80%+)** 🟠
- Business logic
- API endpoints
- Data transformations
- Validation logic

**Medium (Target 70%+)** 🟡
- Utility functions
- Formatters
- Helpers

**Low (Target 60%+)** ⚪
- Configuration
- Constants
- Types/interfaces

## Execution Process

I will:

1. **Run coverage analysis**
   ```bash
   npm test -- --coverage
   ```

2. **Parse coverage report**
   - Identify files below 80%
   - Extract uncovered line numbers
   - Categorize by priority

3. **Analyze uncovered code**
   - Examine each uncovered function
   - Identify test scenarios needed
   - Determine test complexity

4. **Generate test files**
   - Create test file if doesn't exist
   - Follow project's test structure
   - Use project's test framework (Jest/Vitest/etc.)
   - Match existing test patterns

5. **Write comprehensive tests**
   - Happy path cases
   - Error conditions
   - Edge cases
   - Integration scenarios

6. **Run new tests**
   ```bash
   npm test
   ```

7. **Verify coverage improved**
   ```bash
   npm test -- --coverage
   ```

8. **Generate report**
   - Coverage before/after
   - Tests added
   - Remaining gaps

## Test Report

```markdown
# Test Coverage Report
Generated: 2025-10-31 12:34:56

## Coverage Improvement

### Before
- Overall: 62.5%
- Statements: 65.2%
- Branches: 58.7%
- Functions: 71.3%
- Lines: 64.8%

### After
- Overall: 84.3% (+21.8%) ✅
- Statements: 86.1% (+20.9%)
- Branches: 79.2% (+20.5%)
- Functions: 88.7% (+17.4%)
- Lines: 85.9% (+21.1%)

**Target Achieved**: ✅ 80%+ coverage

## Tests Generated

### Total: 147 new tests

By Priority:
- Critical files: 52 tests
- High priority: 67 tests
- Medium priority: 23 tests
- Low priority: 5 tests

By Type:
- Happy path: 58 tests
- Error conditions: 43 tests
- Edge cases: 31 tests
- Integration: 15 tests

## Files Updated

### src/services/paymentService.test.ts
- Tests added: 23
- Coverage: 12.5% → 91.3% (+78.8%)
- Scenarios covered: Full/partial refunds, failed payments, webhooks

### src/services/authService.test.ts
- Tests added: 18
- Coverage: 34.2% → 87.6% (+53.4%)
- Scenarios covered: Login, registration, token refresh, password reset

[... full list]

## Remaining Gaps

### Low Priority (< 80% but acceptable)
- src/config/constants.ts: 45.2%
  - Reason: Static configuration, low risk
- src/types/index.ts: 0%
  - Reason: Type definitions only

### Recommended Next Steps
1. Add integration tests for order flow
2. Add E2E tests for checkout process
3. Consider property-based testing for validators

---

Coverage goal achieved! 🎉
```

Starting test coverage analysis now...
