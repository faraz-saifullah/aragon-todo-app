# Kanban Task Management App

A modern, full-stack task management application built with Next.js, TypeScript, Prisma, and PostgreSQL. Features a beautiful dark-themed Kanban interface with **custom columns**, full CRUD operations, comprehensive testing, and professional-grade responsive design.

![Kanban App](aragon-sample-ui.webp)

## ⚡ Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env

# 3. Start PostgreSQL with Docker
npm run db:up

# 4. Run migrations
npm run migrate

# 5. Seed with sample data
npm run seed

# 6. Start dev server
npm run dev
# Open http://localhost:3000
```

## 🚀 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete boards, tasks, and columns
- 🎨 **Custom Columns** - Create your own status columns beyond TODO/DOING/DONE with custom colors
- 👥 **User Assignment** - Assign tasks to team members with avatar display
- 📜 **Task History** - Track all changes to tasks with detailed audit trail
- 🔔 **Toast Notifications** - Success/error feedback for all user actions
- ⚠️ **Confirmation Modals** - Professional confirmation dialogs for destructive actions
- 🌈 **Color Coding** - Visual status indicators with customizable column colors
- 🔄 **Real-time Updates** - Instant UI updates after any operation
- ✨ **Enhanced Form Validation** - Client-side and server-side validation with onBlur validation, character counters, and auto-focus
- 🎯 **Type Safety** - Full TypeScript coverage throughout the application
- 🗄️ **PostgreSQL Database** - Robust database with Prisma ORM and optimized indexes
- 🐳 **Docker Setup** - Easy local development with Docker Compose
- 📱 **Fully Responsive** - Mobile-first design with hamburger menu, works on all devices
- 🎭 **Professional UX** - Hover states, loading spinners, empty states, status indicators
- 🧪 **Test Coverage** - 9 passing tests covering API routes and service layer
- 💾 **Persistent Selection** - Board selection saved in localStorage

## 📋 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development with strict mode
- **Tailwind CSS 4** - Utility-first CSS with custom theme (`@theme` directive)
- **React Hooks** - State management (useState, useEffect, useCallback, useMemo)
- **Plus Jakarta Sans** - Custom Google Font

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern ORM with database indexes
- **Zod** - Schema validation library
- **PostgreSQL** - Relational database

### Testing & Quality

- **Jest** - Testing framework
- **9 Passing Tests** - API routes + service layer coverage
- **ESLint** - Code linting
- **Prettier** - Code formatting

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
│   ├── Navigation.tsx            # Main navigation wrapper
│   ├── BoardList.tsx             # Sidebar with board navigation
│   ├── BoardView.tsx             # Kanban board layout container
│   ├── KanbanColumn.tsx          # Dynamic status columns
│   ├── TaskCard.tsx              # Individual task card (with assignee avatar)
│   ├── Modal.tsx                 # Reusable modal and form components
│   ├── BoardFormModal.tsx        # Create/edit board modal
│   ├── TaskFormModal.tsx         # Create/edit task modal (with history)
│   ├── ColumnFormModal.tsx       # Create/edit column modal
│   ├── ConfirmModal.tsx          # Confirmation dialog for destructive actions
│   └── ToastContainer.tsx        # Toast notifications for feedback
├── contexts/
│   └── ToastContext.tsx          # Toast notification context
├── lib/
│   ├── db.ts                     # Prisma client instance
│   ├── types.ts                  # TypeScript type definitions
│   ├── hooks.ts                  # Custom React hooks
│   ├── validation.ts             # Zod validation schemas
│   ├── api-utils.ts              # API error handling utilities
│   └── services/
│       ├── board.service.ts      # Board database operations
│       ├── task.service.ts       # Task database operations
│       ├── column.service.ts     # Column database operations
│       └── user.service.ts       # User database operations
├── __tests__/                    # Test files
│   ├── api/
│   │   └── boards.test.ts        # API route tests
│   ├── services/
│   │   └── board.service.test.ts # Service layer tests
│   └── test-utils.ts             # Test utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data script
├── docker-compose.yml            # PostgreSQL container setup
├── .env                          # Environment variables
└── .env.example                  # Environment template
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

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

The `.env.example` file contains:

```env
# Database Configuration
DATABASE_URL="postgresql://dev:devpassword@localhost:5432/aragon_dev?schema=public"

# PostgreSQL Docker Configuration
POSTGRES_USER=dev
POSTGRES_PASSWORD=devpassword
POSTGRES_DB=aragon_dev
POSTGRES_PORT=5432

# Application Configuration
PORT=3000
NODE_ENV=development
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

This creates the necessary database tables based on the Prisma schema.

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
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run db:up        # Start PostgreSQL container
npm run db:down      # Stop PostgreSQL container
npm run migrate      # Run Prisma migrations
npm run seed         # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  avatar        String?  // Avatar initials or URL
  assignedTasks Task[]   @relation("TaskAssignee")
  createdTasks  Task[]   @relation("TaskCreator")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Board Model

```prisma
model Board {
  id          String         @id @default(uuid())
  title       String
  description String?
  tasks       Task[]
  columns     StatusColumn[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}
```

### StatusColumn Model

```prisma
model StatusColumn {
  id        String   @id @default(uuid())
  boardId   String
  name      String   // "TODO", "In Review", "Blocked", etc.
  order     Int      // Display order
  color     String?  // Hex color like "#FF6B6B"
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([boardId, order])
  @@unique([boardId, name]) // Prevent duplicate column names per board
}
```

### Task Model

```prisma
model Task {
  id          String        @id @default(uuid())
  title       String
  description String?
  statusId    String
  status      StatusColumn  @relation(fields: [statusId], references: [id], onDelete: Cascade)
  order       Int           @default(0)
  boardId     String
  board       Board         @relation(fields: [boardId], references: [id], onDelete: Cascade)
  assigneeId  String?
  assignee    User?         @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  creatorId   String
  creator     User          @relation("TaskCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  history     TaskHistory[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([boardId])
  @@index([statusId, order])
  @@index([boardId, statusId, order])
  @@index([assigneeId])
  @@index([creatorId])
}
```

### TaskHistory Model

```prisma
model TaskHistory {
  id        String   @id @default(uuid())
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  field     String   // "status", "assignee", "title", "description"
  oldValue  String?
  newValue  String?
  changedAt DateTime @default(now())

  @@index([taskId, changedAt])
}
```

**Key Features:**

- UUID primary keys for scalability
- **User management** - Assign and track task creators and assignees
- **Task history** - Complete audit trail of all task changes
- Cascade delete (deleting a board deletes its columns and tasks)
- **Custom columns** - Each board can have its own set of status columns with custom colors
- **Flexible workflow** - Not limited to TODO/DOING/DONE
- Database indexes on critical fields for query performance
- Unique constraint prevents duplicate column names per board
- Timestamps for audit trails

## 🔌 API Endpoints

### Boards

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| GET    | `/api/boards`     | Get all boards                 |
| POST   | `/api/boards`     | Create a new board             |
| GET    | `/api/boards/:id` | Get a board with columns/tasks |
| PUT    | `/api/boards/:id` | Update a board                 |
| DELETE | `/api/boards/:id` | Delete a board (and its tasks) |

### Columns

| Method | Endpoint           | Description                     |
| ------ | ------------------ | ------------------------------- |
| GET    | `/api/columns`     | Get columns for a board         |
| POST   | `/api/columns`     | Create a new column             |
| PUT    | `/api/columns/:id` | Update a column (name/color)    |
| DELETE | `/api/columns/:id` | Delete a column (and its tasks) |

### Users

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| GET    | `/api/users` | Get all users |

### Tasks

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/tasks?boardId=` | Get all tasks for board |
| POST   | `/api/tasks`          | Create a new task       |
| GET    | `/api/tasks/:id`      | Get a specific task     |
| PUT    | `/api/tasks/:id`      | Update a task           |
| DELETE | `/api/tasks/:id`      | Delete a task           |

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
  "statusId": "column-uuid",
  "boardId": "board-uuid",
  "assigneeId": "user-uuid",
  "creatorId": "user-uuid"
}
```

## 🎨 Design System

### Color Palette (Custom Theme)

The app uses CSS custom properties defined in `app/globals.css`:

- **Surface Primary:** `#2b2c37` (dark gray background)
- **Surface Secondary:** `#20212c` (darker gray)
- **Surface Accent:** `#635fc7` (purple for interactive elements)
- **Text Primary:** `#ffffff` (white text)
- **Text Secondary:** `#828fa3` (muted gray)
- **Status Colors:**
  - TODO: `#49c4e5` (cyan)
  - DOING: `#635fc7` (purple)
  - DONE: `#67e2ae` (green)

### Typography

- **Font Family**: Plus Jakarta Sans (Google Fonts)
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Loading**: `display: swap` for optimal font loading

## 🧪 Key Features Explained

### State Management

The app uses React hooks and Context API for state management:

- `useBoards` - Manages boards list and CRUD operations
- `useBoard` - Fetches a single board with tasks
- `useTasks` - Manages tasks for a specific board
- `useUsers` - Fetches users for task assignment
- `ToastContext` - Global toast notification system

### Form Validation

All forms include:

- Client-side validation with real-time feedback
- OnBlur validation for immediate user guidance
- Server-side validation with Zod schemas
- Character counters showing remaining space
- Auto-focus on first input when modal opens
- Loading spinners during submission
- Comprehensive error messages

### Testing

The app includes comprehensive test coverage:

- **9 Passing Tests** across 2 test suites
- **API Route Tests**: Testing board CRUD operations
- **Service Layer Tests**: Testing business logic
- **Test Framework**: Jest with TypeScript support
- **Mocking**: Prisma client mocked for isolated testing

Run tests with:

```bash
npm run test          # Run all tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Generate coverage report
```

See `__tests__/README.md` for detailed test documentation.

### Service Layer Pattern

Business logic is separated into service files:

- `board.service.ts` - Board operations (includes transaction for default columns)
- `task.service.ts` - Task operations (includes history tracking)
- `column.service.ts` - Column operations
- `user.service.ts` - User operations

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

## 🔮 Future Enhancements

If given more time, here are additional features that could be added:

### High Priority

- **Optimistic Updates**: Update UI before API response for snappier UX
- **Expand Test Coverage**: Add component tests with React Testing Library and E2E tests with Playwright

### Medium Priority

- **User Authentication**: Multi-user login with NextAuth.js (user system is ready, just needs auth)
- **Task Search**: Global search and filter tasks across boards
- **Due Dates**: Add deadlines and reminders to tasks
- **Task Comments**: Add discussion threads to tasks
- **Column Reordering**: Drag-and-drop to reorder columns (API ready, just needs frontend)
- **Pagination**: Add pagination for boards with 100+ tasks

### Nice to Have

- **Dark/Light Mode Toggle**: User preference system (currently dark theme only)
- **Keyboard Shortcuts**: Power user features (e.g., 'c' to create task, 'esc' to close modal)
- **Export/Import**: Data portability (JSON/CSV export for boards)
- **Real-time Collaboration**: WebSocket updates for multi-user editing
- **Task Dependencies**: Link tasks together with "blocked by" relationships
- **Subtasks**: Break large tasks into smaller ones with progress tracking
- **Email Notifications**: Notify users when assigned or mentioned

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
**Last Updated**: October 25, 2025
