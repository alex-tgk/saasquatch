# Task Completion Checklist

When completing a task in this project:

1. **Code Quality**
   - Run TypeScript compilation: `npx tsc --noEmit`
   - Ensure strict mode compliance
   - Add proper types for all parameters

2. **Testing**
   - Run tests: `npm test`
   - Ensure all tests pass
   - Add tests for new functionality

3. **Generated Services Validation**
   - Generate a test project
   - Install dependencies in generated project
   - Build generated services
   - Run generated services
   - Test health endpoints

4. **Documentation**
   - Update relevant docs
   - Add JSDoc comments
   - Update README if needed

5. **Git Commit**
   - Stage changes: `git add .`
   - Commit with conventional commit message
   - Include Co-Authored-By for Claude