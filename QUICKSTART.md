# Quick Start Guide

## ⚡ Fast Setup (5 minutes)

Follow these steps to get the app running:

### 1. Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Docker Desktop installed and running
- [ ] Git installed

### 2. Setup Commands

```bash
# Install dependencies
npm install

# Copy environment template (if needed)
# The .env file should already exist, but if not:
# cp .env.example .env

# Start PostgreSQL
npm run db:up

# Run migrations
npm run migrate

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

### 3. Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 What You'll See

The app will load with 3 pre-seeded boards:

- **Platform Launch** (17 tasks across TODO, DOING, DONE)
- **Marketing Plan** (3 tasks)
- **Roadmap** (2 tasks)

## ✅ Features to Test

1. **View Boards**: Click different boards in the sidebar
2. **Create Board**: Click "+ Create New Board" button
3. **Create Task**: Click "Add Task" button in any column
4. **Edit Task**: Click on any task card to edit
5. **Delete Task**: Hover over a task and click "Delete"
6. **Form Validation**: Try submitting empty forms to see validation
7. **Character Counters**: Watch the character count as you type
8. **Mobile View**: Resize browser or use DevTools to see mobile menu
9. **Responsive Design**: Test on different screen sizes

## 🐛 Troubleshooting

### Docker not starting?

```bash
# Check if Docker Desktop is running
docker ps

# If not running, start Docker Desktop app
```

### Port 5432 in use?

```bash
# Stop existing PostgreSQL
npm run db:down

# Or change port in docker-compose.yml
```

### Database connection error?

```bash
# Reset everything
npm run db:down
npm run db:up
npm run migrate
npm run seed
```

## 📚 Tech Stack Summary

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Docker) + Prisma ORM
- **Validation**: Zod
- **State**: React Hooks
- **Testing**: Jest (9 passing tests)
- **Font**: Plus Jakarta Sans

## 🎨 UI Highlights

- Dark theme with purple accents
- Smooth hover effects with color transitions
- Fully responsive (mobile/tablet/desktop)
- Modal-based forms with validation
- Real-time updates
- Loading spinners
- Character counters
- Auto-focus inputs
- Status color indicators on tasks
- Empty states for better UX

## 📖 Full Documentation

See [README.md](README.md) for complete documentation including:

- Architecture details
- API endpoints
- Database schema
- Design decisions
- Possible improvements

---

**Need help?** Check the Troubleshooting section in README.md
