# Contributing to Wellingborough.ai

We love that you're interested in contributing to Wellingborough.ai! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

### Code Contributions
- Bug fixes and improvements
- New features and functionality
- Performance optimizations
- Documentation updates
- Test coverage improvements

### Community Contributions
- Testing and providing feedback
- Reporting bugs and issues
- Suggesting new features
- Helping other users in discussions
- Sharing the project with others

### Business Contributions
- Local business feedback and requirements
- User experience testing
- Content and data contributions
- Community partnerships

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and Next.js
- Understanding of local business needs (helpful!)

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR-USERNAME/wellingborough-ai.git
     cd wellingborough-ai
     ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your test API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Verify everything works**
   - Open [http://localhost:3000](http://localhost:3000)
   - Check that the page loads without errors

## 📝 Development Workflow

### Creating a Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Making Changes
1. Write your code following our coding standards
2. Add tests for new functionality
3. Update documentation if needed
4. Test your changes thoroughly

### Committing Changes
We use conventional commits for clear history:

```bash
git add .
git commit -m "feat: add business search functionality"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Creating a Pull Request
1. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub:
   - Use a clear, descriptive title
   - Explain what your changes do and why
   - Link any related issues
   - Add screenshots for UI changes

## 🎯 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable and function names

### React/Next.js
- Use functional components with hooks
- Implement proper error boundaries
- Optimize for performance (memoization, lazy loading)
- Follow React best practices

### Styling
- Use Tailwind CSS for all styling
- Follow the established design system
- Ensure mobile-first responsive design
- Use semantic HTML elements

### Code Organization
```typescript
// Good: Clear, typed component
interface BusinessCardProps {
  business: Business;
  onContact: (businessId: string) => void;
}

export function BusinessCard({ business, onContact }: BusinessCardProps) {
  // Component implementation
}
```

## 🧪 Testing

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Writing Tests
- Write unit tests for utilities and hooks
- Write integration tests for components
- Test user interactions and edge cases
- Aim for good test coverage

Example test:
```typescript
import { render, screen } from '@testing-library/react'
import { BusinessCard } from './BusinessCard'

describe('BusinessCard', () => {
  it('displays business name and description', () => {
    const mockBusiness = {
      id: '1',
      name: 'Test Business',
      description: 'A test business'
    }
    
    render(<BusinessCard business={mockBusiness} onContact={jest.fn()} />)
    
    expect(screen.getByText('Test Business')).toBeInTheDocument()
    expect(screen.getByText('A test business')).toBeInTheDocument()
  })
})
```

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or videos if applicable
- Browser and device information
- Console errors (if any)

### Feature Requests
For new features, please describe:
- The problem you're trying to solve
- Your proposed solution
- Why this would benefit the community
- Any implementation ideas

## 🏘️ Local Business Focus

Remember that Wellingborough.ai is built specifically for the Wellingborough community:

### Local Context
- Understand Wellingborough geography and culture
- Consider local business needs and challenges
- Think about mobile usage patterns
- Consider accessibility for all users

### Community Guidelines
- Be respectful and inclusive
- Focus on genuine community benefit
- Consider privacy and data protection
- Support local economic development

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community chat
- **Email**: tech@wellingborough.ai for sensitive issues

### Code Review Process
1. All code changes require review
2. Maintainers will provide constructive feedback
3. Address feedback promptly and professionally
4. Be open to suggestions and improvements

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation
- Community events and meetups

## 📄 Legal

By contributing to Wellingborough.ai, you agree that:
- Your contributions will be licensed under the MIT License
- You have the right to contribute the code/content
- You understand the project's goals and values

---

**Thank you for contributing to Wellingborough.ai!** 

Together, we're building something special for our local community. Every contribution, no matter how small, helps make Wellingborough a more connected and thriving place for local businesses and residents.

*Questions? Don't hesitate to ask in GitHub Discussions or reach out to the maintainers.* 