# Refactor Smart - Pattern-Based Code Refactoring

Transform code to match project's established patterns and modern best practices.

## Refactoring Goals

Apply these transformations automatically:

### 1. Variable Declarations
**Convert var/let to const where possible**

```typescript
// Before
let user = getUser();
let count = users.length;
var status = 'active';

// After
const user = getUser();
const count = users.length;
const status = 'active';
```

**Keep let only when actually reassigned**

```typescript
// Correct usage of let
let count = 0;
for (const item of items) {
  count += item.value; // Reassigned, needs let
}
```

### 2. Function Declarations
**Transform to arrow functions**

```typescript
// Before
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function processUser(user) {
  console.log(user.name);
}

// After
const calculateTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + item.price, 0);

const processUser = (user: User): void => {
  logger.info('Processing user', { name: user.name });
};
```

**Single expression arrow functions**

```typescript
// Before
const double = (x) => {
  return x * 2;
};

// After
const double = (x: number): number => x * 2;
```

### 3. Destructuring
**Object destructuring**

```typescript
// Before
const name = user.name;
const email = user.email;
const age = user.age;

function greet(user) {
  return `Hello, ${user.name}!`;
}

// After
const { name, email, age } = user;

const greet = ({ name }: User): string => `Hello, ${name}!`;
```

**Array destructuring**

```typescript
// Before
const first = items[0];
const second = items[1];
const rest = items.slice(2);

// After
const [first, second, ...rest] = items;
```

**Nested destructuring**

```typescript
// Before
const city = user.address.city;
const country = user.address.country;

// After
const {
  address: { city, country },
} = user;
```

### 4. Spacing and Formatting
**Consistent spacing**

```typescript
// Before
function calculate(a,b,c){
  return a+b*c;
}

const obj={name:'test',age:25};

// After
function calculate(a: number, b: number, c: number): number {
  return a + b * c;
}

const obj = { name: 'test', age: 25 };
```

**Line breaks and indentation**

```typescript
// Before
const config = { host: 'localhost', port: 3000, database: 'mydb', user: 'admin', password: 'secret' };

// After
const config = {
  host: 'localhost',
  port: 3000,
  database: 'mydb',
  user: 'admin',
  password: 'secret',
};
```

### 5. Object/Array Methods
**Use modern methods**

```typescript
// Before
const ids = [];
for (let i = 0; i < users.length; i++) {
  ids.push(users[i].id);
}

// After
const ids = users.map((user) => user.id);
```

**Concise method syntax**

```typescript
// Before
const obj = {
  getName: function () {
    return this.name;
  },
  setName: function (name) {
    this.name = name;
  },
};

// After
const obj = {
  getName() {
    return this.name;
  },
  setName(name: string) {
    this.name = name;
  },
};
```

### 6. Immutability Patterns
**Avoid mutations**

```typescript
// Before
function addItem(array, item) {
  array.push(item);
  return array;
}

const updateUser = (user, updates) => {
  user.name = updates.name;
  user.email = updates.email;
  return user;
};

// After
const addItem = <T>(array: T[], item: T): T[] => [...array, item];

const updateUser = (user: User, updates: Partial<User>): User => ({
  ...user,
  ...updates,
});
```

**Immutable operations**

```typescript
// Before
users.sort();
items.reverse();

// After
const sortedUsers = [...users].sort();
const reversedItems = [...items].reverse();
```

### 7. Service Provider Pattern
**Extract business logic to services**

```typescript
// Before - Controller doing too much
export const createUser = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.users.create({ email, password: hashedPassword });
  await emailService.send(email, 'Welcome!');
  res.json(user);
};

// After - Clean separation
// services/userService.ts
export class UserService {
  constructor(
    private db: Database,
    private emailService: EmailService
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const hashedPassword = await this.hashPassword(input.password);
    const user = await this.db.users.create({
      email: input.email,
      password: hashedPassword,
    });
    await this.sendWelcomeEmail(user.email);
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    await this.emailService.send(email, 'Welcome!');
  }
}

// controllers/userController.ts
export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.json(user);
};
```

### 8. Error Handling
**Consistent error handling**

```typescript
// Before
async function getUser(id) {
  const user = await db.users.findOne(id);
  if (!user) throw new Error('Not found');
  return user;
}

// After
async function getUser(id: string): Promise<User> {
  const user = await db.users.findOne(id);
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }
  return user;
}
```

### 9. TypeScript Improvements
**Add proper types**

```typescript
// Before
function processData(data: any) {
  return data.results.map((item) => item.value);
}

// After
interface ApiResponse {
  results: Array<{ value: number }>;
}

const processData = (data: ApiResponse): number[] =>
  data.results.map((item) => item.value);
```

**Use type inference**

```typescript
// Before
const users: User[] = await getUsers();
const count: number = users.length;

// After (types inferred)
const users = await getUsers(); // Type is User[]
const count = users.length; // Type is number
```

### 10. Template Literals
**Use template literals for strings**

```typescript
// Before
const message = 'Hello, ' + name + '! You have ' + count + ' messages.';

// After
const message = `Hello, ${name}! You have ${count} messages.`;
```

## Refactoring Scope

I'll analyze and refactor:

### File Selection
- **All files**: Refactor entire codebase
- **Changed files**: Only files in current git diff
- **Specific path**: User-specified files/directories
- **Excluding**: node_modules, dist, build, .git

### Safety Checks
Before refactoring, I'll:
1. ✅ Run tests to ensure they pass
2. ✅ Check TypeScript compilation
3. ✅ Verify ESLint compliance
4. ✅ Create git stash of current changes
5. ✅ Backup files being modified

## Refactoring Process

### Phase 1: Analysis
**Scan for patterns**

```
Analyzing codebase...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found refactoring opportunities:
├─ var declarations: 12 instances
├─ let → const: 87 instances
├─ function → arrow: 45 instances
├─ missing destructuring: 156 instances
├─ mutation patterns: 23 instances
├─ spacing issues: 234 instances
└─ TypeScript any: 15 instances

Total files to refactor: 34
Estimated time: 2-3 minutes
```

### Phase 2: Transformation
**Apply refactorings**

I'll apply transformations in this order:
1. Variable declarations (var → const/let)
2. Function declarations → arrow functions
3. Add destructuring
4. Fix spacing and formatting
5. Apply immutability patterns
6. Extract to services (if applicable)
7. Improve error handling
8. Add/improve TypeScript types
9. Use template literals

### Phase 3: Verification
**Ensure nothing broke**

After each file:
```bash
# Type check
tsc --noEmit

# Lint
eslint src --ext .ts

# Format
prettier --check "src/**/*.ts"

# Test
npm test
```

### Phase 4: Reporting
**Generate refactoring report**

```markdown
# Refactoring Report
Generated: 2025-10-31 12:34:56

## Summary
- Files Modified: 34
- Lines Changed: +456, -389
- Transformations Applied: 572

## Transformations by Category

### Variable Declarations (99 changes)
- var → const: 12
- let → const: 87

### Function Style (45 changes)
- function → arrow function: 45
- Added return types: 45

### Destructuring (156 changes)
- Object destructuring: 123
- Array destructuring: 21
- Parameter destructuring: 12

### Immutability (23 changes)
- Array mutations: 15
- Object mutations: 8

### Spacing & Formatting (234 changes)
- Operator spacing: 89
- Object/array formatting: 78
- Line breaks: 67

### TypeScript (15 changes)
- Replaced 'any' types: 15
- Added explicit return types: 45

## Files Modified

### src/services/userService.ts
- let → const: 8 changes
- Added destructuring: 12 changes
- function → arrow: 5 changes
- Immutability: 3 changes

### src/controllers/authController.ts
- let → const: 6 changes
- Added destructuring: 9 changes
- Template literals: 7 changes

[... full list of all files]

## Code Quality Improvement

### Before
```typescript
function getUser(id) {
  let user = users.find(function(u) {
    return u.id == id;
  });
  return user;
}
```

### After
```typescript
const getUser = (id: string): User | undefined =>
  users.find((u) => u.id === id);
```

## Verification Results
✅ TypeScript compilation: Pass
✅ ESLint: Pass
✅ Prettier: Pass
✅ Tests: 127 passed, 0 failed
✅ No breaking changes detected

## Next Steps
1. Review changes: `git diff`
2. Run full test suite: `npm test`
3. Commit changes: `git commit -m "refactor: apply modern patterns"`
```

## Customization Options

I'll ask about:

**Refactoring Scope**
- Entire codebase
- Changed files only
- Specific directory
- Single file

**Transformation Preferences**
- Aggressive (all transformations)
- Conservative (safe transformations only)
- Custom (select specific transformations)

**Backup Strategy**
- Git stash before refactoring
- Create backup branch
- Just proceed (if tests exist)

## Rollback

If anything goes wrong:
```bash
# Restore from stash
git stash pop

# Or reset to before refactoring
git reset --hard HEAD
```

Starting smart refactoring now...
