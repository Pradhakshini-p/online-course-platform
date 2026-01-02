# Fix: Repository Not Found Error

The error means the GitHub repository doesn't exist yet. Here's how to fix it:

## Option 1: Create Repository on GitHub First (Recommended)

1. **Go to GitHub**: https://github.com
2. **Click the + icon** (top right) → **New repository**
3. **Repository name**: `online-course-platform`
4. **Description**: "Full stack online course platform with React, Node.js, MongoDB"
5. **Visibility**: Choose Public or Private
6. **IMPORTANT**: Do NOT check "Initialize with README" (we already have files)
7. **Click "Create repository"**

After creating, try pushing again:
```bash
git push -u origin main
```

## Option 2: Check Repository Name

Make sure the repository name matches exactly. Check:
- Username: `Pradhakshini_p` (correct?)
- Repository name: `online-course-platform` (exists on GitHub?)

## Option 3: Authentication Issues

If repository exists but you still get errors, you might need to authenticate:

### Using Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. When pushing, use token as password:
```bash
git push -u origin main
# Username: Pradhakshini_p
# Password: <your-personal-access-token>
```

### Using GitHub CLI (if installed):
```bash
gh auth login
gh repo create online-course-platform --public --source=. --remote=origin --push
```

## Option 4: Verify Remote URL

Check your remote URL:
```bash
git remote -v
```

Should show:
```
origin  https://github.com/Pradhakshini_p/online-course-platform.git (fetch)
origin  https://github.com/Pradhakshini_p/online-course-platform.git (push)
```

If wrong, fix it:
```bash
git remote set-url origin https://github.com/Pradhakshini_p/online-course-platform.git
```

