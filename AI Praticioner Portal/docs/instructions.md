1. All Code must have a corresponding test 
2. Code will not be implemented until the test is complete and pass
3. never add new folders to the project stucture unless i am consulted and the impact is analysed 
4. Once a task is complete:
   - Check the code in
   - Push to remote repository
   - Update the devlog with the changes
   - Ensure documentation reflects the changes
5. Add all additional tasks and problem resolutions to the checklist
6. Follow the implementation order:
   - Phase 1: Critical Security & Stability
   - Phase 2: Core Functionality & Performance
   - Phase 3: User Experience & Analytics
   - Phase 4: Enhancements & Polish
7. Ensure Checklists are updated and removed when complete
7. Resolve all code problems fully when they appear
### Code Standards

#### TypeScript
- ✅ Use strict mode
- ✅ Always use interfaces for component props
- ✅ Use enums for fixed sets of values
- ✅ Implement proper error handling
- ✅ Use TypeScript path aliases for imports
- ✅ Follow the existing type structure in `types/`
- ✅ Use proper generics for collections
- ✅ Implement proper type guards
- ✅ Use readonly types for immutable data
- ✅ Use proper union types for variant data

#### React
- ✅ Use functional components with hooks
- ✅ Implement proper error boundaries
- ✅ Use memoization for performance
- ✅ Follow accessibility guidelines
- ✅ Maintain consistent prop types
- ✅ Use proper event handlers
- ✅ Implement proper context usage
- ✅ Use proper component composition

#### Backend
- ✅ Use Pydantic for data validation
- ✅ Implement proper dependency injection
- ✅ Use proper database transactions
- ✅ Implement proper error handling
- ✅ Use proper logging
- ✅ Implement proper security measures
- ✅ Use proper caching mechanisms
- ✅ Implement proper rate limiting

#### React
- Use functional components with hooks
- Implement proper error boundaries
- Use memoization for performance
- Follow accessibility guidelines
- Maintain consistent prop types

#### State Management
- Use Redux for global state
- Implement proper action creators
- Use selectors for state access
- Maintain proper reducer structure

### Development Process
- Always update devlog with:
  - Completed tasks
  - Changes made
  - Next steps
  - Technical decisions
  - Testing status
  - Structural changes
  - Code improvements

- Documentation requirements:
  - API endpoints
  - Security measures
  - Component architecture
  - State management
  - Error handling
  - Performance optimizations

### Testing Requirements
- Unit tests for all components
- Integration tests for workflows
- E2E tests for critical paths
- Performance benchmarks
- Accessibility testing

### Error Handling
- Implement proper error boundaries
- Add retry mechanisms
- Log errors appropriately
- Provide user-friendly error messages
- Implement loading states

### Performance Optimization
- Use memoization
- Implement proper caching
- Optimize component rendering
- Use code splitting
- Implement lazy loading

### Accessibility
- Use proper ARIA labels
- Implement keyboard navigation
- Add focus management
- Ensure proper color contrast
- Follow WCAG guidelines

### Security
- Implement proper input validation
- Use secure API endpoints
- Implement proper authentication
- Follow security best practices
- Regular security audits

## Documentation Requirements

1. Keep the devlog updated with:
   - Completed tasks
   - Changes made
   - Next steps
   - Technical decisions
   - Testing status
   - Structural changes
   - Code improvements

2. Maintain documentation for:
   - API endpoints
   - Security measures
   - Component architecture
   - State management
   - Error handling
   - Performance optimizations
   - Accessibility features

## Code Review Checklist

### TypeScript
- [ ] Proper type definitions
- [ ] Interface usage
- [ ] Error handling
- [ ] Performance considerations

### React
- [ ] Proper component structure
- [ ] Error boundaries
- [ ] Accessibility
- [ ] Performance optimization

### State Management
- [ ] Proper Redux usage
- [ ] Action creators
- [ ] Selectors
- [ ] Reducer structure

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

### Security
- [ ] Input validation
- [ ] API security
- [ ] Authentication
- [ ] Security measures

### Performance
- [ ] Memoization
- [ ] Caching
- [ ] Code splitting
- [ ] Lazy loading

### Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] WCAG compliance

## Project Structure Preservation

### Frontend Structure
- Maintain `mcp_project_frontend` directory
- Keep component organization
- Preserve type definitions
- Maintain hook structure
- Keep utility functions organized

### Backend Structure
- Maintain `mcp_project_backend` directory
- Keep API structure
- Preserve database schema
- Maintain security measures

### Documentation Structure
- Keep architecture documentation
- Maintain API documentation
- Preserve security documentation
- Keep testing documentation

## Change Management

### Before any major changes:
- Update devlog
- Document technical decisions
- Review impact on existing code
- Plan testing strategy
- Consider security implications

### After changes:
- Update documentation
- Run tests
- Verify performance
- Check security
- Update devlog
