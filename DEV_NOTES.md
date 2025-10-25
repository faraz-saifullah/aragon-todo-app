# Development Notes

## Important Setup Information

### Docker Note

⚠️ **Docker Desktop must be running before starting the database**

If you see the error "Cannot connect to the Docker daemon", start Docker Desktop first:

1. Open Docker Desktop application
2. Wait for it to fully start (icon in menu bar should be stable)
3. Then run: `npm run db:up`

### Database Connection

The application connects to PostgreSQL running in a Docker container on `localhost:5432`.

Connection string format:

```
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?schema=public"
```

Default credentials (from `.env`):

- User: `dev`
- Password: `devpassword`
- Database: `aragon_dev`
- Port: `5432`

### First Time Setup Sequence

**Critical**: Follow this exact order:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start Docker PostgreSQL**

   ```bash
   npm run db:up
   ```

   ✅ Verify: Run `docker ps` - you should see a postgres:14 container running

3. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

4. **Run migrations**

   ```bash
   npm run migrate
   ```

   - When prompted for migration name, enter: `init`
   - This creates the Board and Task tables

5. **Seed the database**

   ```bash
   npm run seed
   ```

   - Creates 3 sample boards with 22 tasks
   - Based on the Platform Launch example from the design

6. **Start development server**

   ```bash
   npm run dev
   ```

   - Opens on http://localhost:3000

## Common Issues & Solutions

### Issue: "Cannot connect to Docker daemon"

**Solution**: Start Docker Desktop application

### Issue: "Port 5432 already in use"

**Solution**:

- Stop other PostgreSQL instances
- Or change port in `docker-compose.yml`

### Issue: "Prisma Client not generated"

**Solution**:

```bash
npx prisma generate
```

### Issue: "Table does not exist"

**Solution**:

```bash
npm run migrate
```

### Issue: "No boards showing up"

**Solution**:

```bash
npm run seed
```

### Issue: Module not found errors

**Solution**:

```bash
rm -rf node_modules
npm install
```

### Issue: Database connection refused

**Solution**:

1. Check Docker is running: `docker ps`
2. Restart container: `npm run db:down && npm run db:up`
3. Wait 5-10 seconds for container to be ready
4. Try again

## Development Workflow

### Making Database Changes

1. Edit `prisma/schema.prisma`
2. Create migration: `npm run migrate`
3. Prisma Client auto-regenerates
4. Update service layer if needed

### Resetting Database

```bash
npm run db:down    # Stop container
npm run db:up      # Start fresh container
npm run migrate    # Re-run migrations
npm run seed       # Re-seed data
```

### Viewing Database

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 - a GUI for viewing/editing data.

## File Organization

### Backend

- `/app/api/` - API route handlers
- `/lib/services/` - Business logic
- `/lib/validation.ts` - Zod schemas
- `/lib/db.ts` - Prisma client

### Frontend

- `/app/page.tsx` - Main application component
- `/components/` - Reusable UI components
- `/lib/hooks.ts` - Custom React hooks
- `/lib/types.ts` - TypeScript types

### Config

- `prisma/schema.prisma` - Database schema
- `tailwind.config.ts` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration

## API Testing

You can test API endpoints with curl:

```bash
# Get all boards
curl http://localhost:3000/api/boards

# Create a board
curl -X POST http://localhost:3000/api/boards \
  -H "Content-Type: application/json" \
  -d '{"title":"New Board","description":"Test board"}'

# Get tasks for a board
curl http://localhost:3000/api/tasks?boardId=BOARD_ID

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","status":"TODO","boardId":"BOARD_ID"}'
```

## Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://dev:devpassword@localhost:5432/aragon_dev?schema=public"
PORT=3000
```

⚠️ `.env` is gitignored - never commit it!  
✅ `.env.example` is provided as a template

## TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` maps to root directory
- Target: ES2022
- Module: ESNext

## Build Process

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

## Dependencies

### Core

- next@16.0.0
- react@19.2.0
- typescript@5

### Database

- @prisma/client@6.18.0
- prisma@6.18.0

### Validation

- zod@4.1.12

### Styling

- tailwindcss@4
- @tailwindcss/postcss@4

### Dev Tools

- ts-node (for seed script)
- eslint (linting)

## Performance Considerations

1. **Database Queries**
   - Prisma automatically handles connection pooling
   - Queries include only necessary fields
   - Proper indexing on foreign keys

2. **API Routes**
   - Validation happens early (fail fast)
   - Errors are caught and formatted consistently
   - Service layer keeps routes thin

3. **Frontend**
   - React hooks prevent unnecessary re-renders
   - Components are properly memoized where needed
   - API calls are debounced in forms

## Security Notes

1. **Input Validation**
   - All inputs validated with Zod
   - Type checking on frontend and backend

2. **SQL Injection**
   - Prisma prevents SQL injection by design
   - All queries are parameterized

3. **Environment Variables**
   - Sensitive data in .env (not committed)
   - Database credentials isolated

## Known Limitations

1. **No Authentication**
   - Would add NextAuth.js for production
   - Currently single-user application

2. **No Real-time Updates**
   - Updates are instant on same client
   - Multiple users need to refresh
   - Would use WebSockets for production

3. **Basic Error Messages**
   - Errors shown in console
   - Would add toast notifications for production

4. **No Drag & Drop**
   - Would use dnd-kit library
   - Requires additional complexity

5. **No Tests**
   - Would add Jest + React Testing Library
   - API routes would use Supertest

## Production Checklist

If deploying to production:

- [ ] Add authentication
- [ ] Set up environment variables on hosting platform
- [ ] Use production database (not Docker)
- [ ] Add error monitoring (e.g., Sentry)
- [ ] Add analytics
- [ ] Implement rate limiting
- [ ] Add HTTPS
- [ ] Set up CI/CD
- [ ] Add automated tests
- [ ] Optimize images
- [ ] Add caching strategy

## Support

For issues:

1. Check this document
2. Check README.md troubleshooting section
3. Check console for error messages
4. Verify Docker is running
5. Verify database connection

---

**Last Updated**: October 25, 2025  
**Version**: 1.0.0
