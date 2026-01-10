# Contributing to Online Course Platform

## Welcome!

Thank you for your interest in contributing to the Online Course Platform! This document provides guidelines and instructions for contributing to the project.

## How to Get Started

### 1. Fork the Repository
- Click the "Fork" button on the GitHub repository page
- Clone your fork locally:
  ```bash
  git clone https://github.com/YOUR_USERNAME/online-course-platform.git
  cd online-course-platform
  ```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - for new features
- `bugfix/` - for bug fixes
- `docs/` - for documentation changes
- `test/` - for test additions

### 3. Set Up Development Environment

Refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Development Workflow

### Code Style
- Use consistent indentation (2 spaces for JavaScript)
- Follow ESLint rules configured in the project
- Write meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Use clear, descriptive commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test additions
- `chore:` for maintenance tasks

Example:
```
feat: add user profile page

Implement user profile display with editable sections and profile picture upload
```

## Testing

Before submitting a pull request:
1. Test your changes locally
2. Ensure the application runs without errors
3. Test both frontend and backend functionality

## Submitting a Pull Request

1. Push your changes to your fork
2. Go to the original repository and click "New Pull Request"
3. Provide a clear description of your changes
4. Link any related issues
5. Wait for review and address any feedback

## Project Structure

```
online-course-platform/
├── backend/           # Node.js/Express API server
├── frontend/          # React.js UI application
├── docs/              # Documentation
├── README.md          # Project overview
├── SETUP_GUIDE.md     # Setup instructions
└── CONTRIBUTING.md    # This file
```

## Questions or Issues?

- Open an issue on GitHub for bugs or feature requests
- Discuss major changes in an issue before starting development

## License

This project is licensed under the ISC License. By contributing, you agree that your contributions will be licensed under its ISC License.

Thank you for contributing!
