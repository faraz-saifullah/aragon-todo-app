# Kanban Task Management App

A modern, full-stack task management application built with Next.js, TypeScript, Prisma, and PostgreSQL. Features a beautiful dark-themed Kanban interface with full CRUD operations for boards and tasks.

![Kanban App](aragon-sample-ui.webp)

## 🚀 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete boards and tasks
- 🎨 **Modern Dark UI** - Beautiful, responsive Kanban interface inspired by modern design
- 🔄 **Real-time Updates** - Instant UI updates after any operation
- ✨ **Form Validation** - Client-side and server-side validation using Zod
- 🎯 **Type Safety** - Full TypeScript coverage throughout the application
- 🗄️ **PostgreSQL Database** - Robust database with Prisma ORM
- 🐳 **Docker Setup** - Easy local development with Docker Compose
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎭 **Hover States** - Interactive feedback on all elements

## 📋 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management (useState, useEffect, useCallback)

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern ORM for database operations
- **Zod** - Schema validation library
- **PostgreSQL** - Relational database

### Infrastructure
- **Docker & Docker Compose** - Containerized PostgreSQL
- **TypeScript** - Full type safety

## 🏗️ Architecture

```
aragon-todo-app/
├── app/
│   ├── api/
│   │   ├── boards/
│   │   │   ├── route.ts          # GET /api/boards, POST /api/boards
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PUT, DELETE /api/boards/:id
│   │   └── tasks/
│   │       ├── route.ts          # GET /api/tasks, POST /api/tasks
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE /api/tasks/:id
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main Kanban board page
│   └── globals.css               # Global styles
├── components/
│   ├── BoardList.tsx             # Sidebar with board navigation
│   ├── KanbanColumn.tsx          # Column for TODO/DOING/DONE
│   ├── TaskCard.tsx              # Individual task card
│   ├── Modal.tsx                 # Reusable modal and form components
│   ├── BoardFormModal.tsx        # Create/edit board modal
│   └── TaskFormModal.tsx         # Create/edit task modal
├── lib/
│   ├── db.ts                     # Prisma client instance
│   ├── types.ts                  # TypeScript type definitions
│   ├── hooks.ts                  # Custom React hooks
│   ├── validation.ts             # Zod validation schemas
│   ├── api-utils.ts              # API error handling utilities
│   └── services/
│       ├── board.service.ts      # Board database operations
│       └── task.service.ts       # Task database operations
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data script
├── docker-compose.yml            # PostgreSQL container setup
└── .env                          # Environment variables
```

## 🛠️ Setup & Installation

### Prerequisites

- **Node.js 18+** and npm
- **Docker Desktop** (for PostgreSQL)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aragon-todo-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

The `.env` file should already exist with the following configuration:

```env
DATABASE_URL="postgresql://dev:devpassword@localhost:5432/aragon_dev?schema=public"
PORT=3000
```

### 4. Start PostgreSQL with Docker

```bash
npm run db:up
```

This will start a PostgreSQL container in the background.

### 5. Run Database Migrations

```bash
npm run migrate
```

When prompted, provide a migration name (e.g., "init").

### 6. Seed the Database

```bash
npm run seed
```

This populates the database with sample boards and tasks.

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:up        # Start PostgreSQL container
npm run db:down      # Stop PostgreSQL container
npm run migrate      # Run Prisma migrations
npm run seed         # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 🗄️ Database Schema

### Board Model

```prisma
model Board {
  id          String   @id @default(uuid())
  title       String
  description String?
  order       Int      @default(0)
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Task Model

```prisma
model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  order       Int        @default(0)
  boardId     String
  board       Board      @relation(fields: [boardId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  TODO
  DOING
  DONE
}
```

## 🔌 API Endpoints

### Boards

| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| GET    | `/api/boards`       | Get all boards                 |
| POST   | `/api/boards`       | Create a new board             |
| GET    | `/api/boards/:id`   | Get a board with its tasks     |
| PUT    | `/api/boards/:id`   | Update a board                 |
| DELETE | `/api/boards/:id`   | Delete a board (and its tasks) |

### Tasks

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/tasks?boardId=` | Get all tasks for board  |
| POST   | `/api/tasks`          | Create a new task        |
| GET    | `/api/tasks/:id`      | Get a specific task      |
| PUT    | `/api/tasks/:id`      | Update a task            |
| DELETE | `/api/tasks/:id`      | Delete a task            |

### Request/Response Examples

#### Create Board

```bash
POST /api/boards
Content-Type: application/json

{
  "title": "Product Launch",
  "description": "Launch planning board"
}
```

Response:
```json
{
  "data": {
    "id": "uuid",
    "title": "Product Launch",
    "description": "Launch planning board",
    "order": 0,
    "createdAt": "2025-10-25T...",
    "updatedAt": "2025-10-25T..."
  },
  "message": "Board created successfully"
}
```

#### Create Task

```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create mockups for the homepage",
  "status": "TODO",
  "boardId": "board-uuid"
}
```

## 🎨 Design System

### Color Palette

- **Background:** `#0a0c10` (gray-950)
- **Surface:** `#14161d` (gray-900), `#1a1d26` (gray-850), `#21252e` (gray-800)
- **Accent:** `#9333ea` (purple-600)
- **Text:** `#ffffff` (white), `#9ca3af` (gray-400)
- **Status Colors:**
  - TODO: Cyan (`#22d3ee`)
  - DOING: Purple (`#a855f7`)
  - DONE: Green (`#4ade80`)

### Typography

- Font: System UI stack
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)

## 🧪 Key Features Explained

### State Management

The app uses React hooks for state management:
- `useBoards` - Manages boards list and CRUD operations
- `useBoard` - Fetches a single board with tasks
- `useTasks` - Manages tasks for a specific board

### Form Validation

All forms include:
- Client-side validation (real-time feedback)
- Server-side validation with Zod schemas
- Comprehensive error messages

### Service Layer Pattern

Business logic is separated into service files:
- `board.service.ts` - Board operations
- `task.service.ts` - Task operations

This keeps API routes clean and testable.

### Error Handling

Consistent error handling across the application:
- Zod validation errors (400)
- Database errors (500)
- Not found errors (404)
- Unique constraint violations (409)

## 🚧 Development Workflow

### Making Changes

1. **Frontend changes**: Modify components in `/components` or pages in `/app`
2. **API changes**: Update route handlers in `/app/api`
3. **Database changes**: 
   - Modify `prisma/schema.prisma`
   - Run `npm run migrate`
   - Update service layer as needed

### Debugging

- **API errors**: Check terminal console for error logs
- **Database issues**: Run `npm run db:studio` to inspect data
- **Frontend issues**: Use browser DevTools

## 🔒 Security & Best Practices

- ✅ Input validation on all endpoints
- ✅ SQL injection prevention via Prisma
- ✅ Type safety with TypeScript
- ✅ Proper error handling and logging
- ✅ Cascade deletes for data integrity
- ✅ Environment variable configuration

## 🎯 Design Decisions & Tradeoffs

### Why Next.js API Routes?

- **Pros**: No CORS issues, same-origin requests, easy deployment
- **Cons**: Coupled to Next.js, less flexibility than standalone API

### Why Prisma?

- **Pros**: Type-safe queries, migrations, great DX
- **Cons**: Slight learning curve, adds abstraction layer

### Why Client-Side State?

- **Pros**: Simple, no external dependencies, works well for this scale
- **Cons**: Wouldn't scale to very large applications (would use React Query/SWR)

## 🔮 Possible Improvements

If given more time, here are enhancements that could be added:

### High Priority
- **Drag & Drop**: Implement drag-and-drop for tasks between columns
- **Optimistic Updates**: Update UI before API response
- **Loading States**: Better loading indicators
- **Toast Notifications**: Success/error toast messages

### Medium Priority
- **User Authentication**: Multi-user support with auth
- **Task Search**: Search and filter tasks
- **Due Dates**: Add deadlines to tasks
- **Task Assignees**: Assign tasks to team members
- **Custom Columns**: Allow custom status columns

### Nice to Have
- **Dark/Light Mode Toggle**: User preference
- **Keyboard Shortcuts**: Power user features
- **Task Comments**: Discussion threads
- **Activity Log**: Track changes
- **Export/Import**: Data portability
- **Real-time Collaboration**: WebSocket updates

## 🐛 Troubleshooting

### Docker Issues

**Problem**: Docker daemon not running
```bash
# Start Docker Desktop, then retry:
npm run db:up
```

**Problem**: Port 5432 already in use
```bash
# Stop other PostgreSQL instances or change port in docker-compose.yml
```

### Database Issues

**Problem**: Migration fails
```bash
# Reset database
npm run db:down
npm run db:up
npm run migrate
npm run seed
```

**Problem**: Connection refused
```bash
# Check if PostgreSQL is running
docker ps
# Should see postgres:14 container
```

### Build Issues

**Problem**: Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## 📄 License

MIT License - feel free to use this project for learning or as a template.

## 🙏 Acknowledgments

Built as part of the Aragon.ai technical assessment. Design inspiration from modern Kanban tools.

---

**Developer**: Built with ❤️ using Next.js, TypeScript, and PostgreSQL
**Time**: ~2.5 hours of focused development
