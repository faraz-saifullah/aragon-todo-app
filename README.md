# Kanban Task Management App

A modern, full-stack task management application built with Next.js, TypeScript, Prisma, and PostgreSQL. Features a beautiful dark-themed Kanban interface with full CRUD operations, comprehensive testing, and professional-grade responsive design.

![Kanban App](aragon-sample-ui.webp)

## 🚀 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete boards and tasks
- 🎨 **Modern Dark UI** - Beautiful, pixel-perfect Kanban interface
- 🔄 **Real-time Updates** - Instant UI updates after any operation
- ✨ **Enhanced Form Validation** - Client-side and server-side validation with onBlur validation, character counters, and auto-focus
- 🎯 **Type Safety** - Full TypeScript coverage throughout the application
- 🗄️ **PostgreSQL Database** - Robust database with Prisma ORM and optimized indexes
- 🐳 **Docker Setup** - Easy local development with Docker Compose
- 📱 **Fully Responsive** - Mobile-first design with hamburger menu, works on all devices
- 🎭 **Professional UX** - Hover states, loading spinners, empty states, status indicators
- 🧪 **Test Coverage** - 9 passing tests covering API routes and service layer

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

### Board Model

```prisma
model Board {
  id          String   @id @default(uuid())
  title       String
  description String?
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

  @@index([boardId])
  @@index([boardId, status, order])
}

enum TaskStatus {
  TODO
  DOING
  DONE
}
```

**Key Features:**

- UUID primary keys for scalability
- Cascade delete (deleting a board deletes its tasks)
- Database indexes on `boardId`, `status`, and `order` for query performance
- Timestamps for audit trails

## 🔌 API Endpoints

### Boards

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| GET    | `/api/boards`     | Get all boards                 |
| POST   | `/api/boards`     | Create a new board             |
| GET    | `/api/boards/:id` | Get a board with its tasks     |
| PUT    | `/api/boards/:id` | Update a board                 |
| DELETE | `/api/boards/:id` | Delete a board (and its tasks) |

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
  "status": "TODO",
  "boardId": "board-uuid"
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

The app uses React hooks for state management:

- `useBoards` - Manages boards list and CRUD operations
- `useBoard` - Fetches a single board with tasks
- `useTasks` - Manages tasks for a specific board

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

- **Drag & Drop**: Implement drag-and-drop for tasks between columns using dnd-kit
- **Optimistic Updates**: Update UI before API response for snappier UX
- **Custom Confirmation Modal**: Replace window.confirm with styled modal
- **Toast Notifications**: Success/error toast messages instead of alerts
- **Expand Test Coverage**: Add component tests with React Testing Library

### Medium Priority

- **User Authentication**: Multi-user support with NextAuth.js
- **Task Search**: Search and filter tasks across boards
- **Due Dates**: Add deadlines and reminders to tasks
- **Task Assignees**: Assign tasks to team members
- **Custom Columns**: Allow users to create custom status columns beyond TODO/DOING/DONE
- **Task Comments**: Add discussion threads to tasks

### Nice to Have

- **Dark/Light Mode Toggle**: User preference system
- **Keyboard Shortcuts**: Power user features (e.g., 'c' to create task)
- **Activity Log**: Track all changes and updates
- **Export/Import**: Data portability (JSON/CSV)
- **Real-time Collaboration**: WebSocket updates for multi-user editing
- **Task Dependencies**: Link tasks together
- **Subtasks**: Break large tasks into smaller ones

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
