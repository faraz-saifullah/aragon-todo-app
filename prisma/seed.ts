import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.statusColumn.deleteMany();
  await prisma.board.deleteMany();

  // Create "Platform Launch" board with columns
  const platformLaunch = await prisma.board.create({
    data: {
      title: 'Platform Launch',
      description: 'Main platform launch board',
      columns: {
        create: [
          { name: 'TODO', order: 0, color: '#49c4e5' },
          { name: 'DOING', order: 1, color: '#635fc7' },
          { name: 'DONE', order: 2, color: '#67e2ae' },
        ],
      },
    },
    include: { columns: true },
  });

  // Get column IDs for Platform Launch
  const todoCol = platformLaunch.columns.find((c) => c.name === 'TODO')!;
  const doingCol = platformLaunch.columns.find((c) => c.name === 'DOING')!;
  const doneCol = platformLaunch.columns.find((c) => c.name === 'DONE')!;

  // Create tasks for Platform Launch
  await prisma.task.createMany({
    data: [
      // TODO tasks
      {
        title: 'Build UI for onboarding flow',
        description: 'Create user-friendly onboarding screens',
        statusId: todoCol.id,
        boardId: platformLaunch.id,
        order: 0,
      },
      {
        title: 'Build UI for search',
        description: 'Implement search functionality',
        statusId: todoCol.id,
        boardId: platformLaunch.id,
        order: 1,
      },
      {
        title: 'Build settings UI',
        description: 'Create settings page',
        statusId: todoCol.id,
        boardId: platformLaunch.id,
        order: 2,
      },
      {
        title: 'QA and test all major user journeys',
        description: 'Complete end-to-end testing',
        statusId: todoCol.id,
        boardId: platformLaunch.id,
        order: 3,
      },
      // DOING tasks
      {
        title: 'Design settings and search pages',
        description: 'Complete design for settings and search',
        statusId: doingCol.id,
        boardId: platformLaunch.id,
        order: 0,
      },
      {
        title: 'Add account management endpoints',
        description: 'Implement account CRUD operations',
        statusId: doingCol.id,
        boardId: platformLaunch.id,
        order: 1,
      },
      {
        title: 'Design onboarding flow',
        description: 'Create onboarding wireframes and mockups',
        statusId: doingCol.id,
        boardId: platformLaunch.id,
        order: 2,
      },
      {
        title: 'Add search endpoints',
        description: 'Implement search API',
        statusId: doingCol.id,
        boardId: platformLaunch.id,
        order: 3,
      },
      {
        title: 'Add authentication endpoints',
        description: 'Implement auth API',
        statusId: doingCol.id,
        boardId: platformLaunch.id,
        order: 4,
      },
      {
        title: 'Research pricing points of various competitors',
        description: 'Market research for pricing strategy',
        statusId: doingCol.id,
        boardId: platformLaunch.id,
        order: 5,
      },
      // DONE tasks
      {
        title: 'Conduct 5 wireframe tests',
        description: 'User testing of wireframes',
        statusId: doneCol.id,
        boardId: platformLaunch.id,
        order: 0,
      },
      {
        title: 'Create wireframe prototype',
        description: 'High-fidelity prototype',
        statusId: doneCol.id,
        boardId: platformLaunch.id,
        order: 1,
      },
      {
        title: 'Review results of usability tests and iterate',
        description: 'Incorporate user feedback',
        statusId: doneCol.id,
        boardId: platformLaunch.id,
        order: 2,
      },
      {
        title: 'Create paper prototypes and conduct 10 usability tests',
        description: 'Early stage user testing',
        statusId: doneCol.id,
        boardId: platformLaunch.id,
        order: 3,
      },
      {
        title: 'Market discovery',
        description: 'Research target market',
        statusId: doneCol.id,
        boardId: platformLaunch.id,
        order: 4,
      },
      {
        title: 'Competitor analysis',
        description: 'Analyze competitor landscape',
        statusId: doneCol.id,
        boardId: platformLaunch.id,
        order: 5,
      },
      {
        title: 'Research the market',
        description: 'Deep market research',
        statusId: doneCol.id,
        boardId: platformLaunch.id,
        order: 6,
      },
    ],
  });

  // Create "Marketing Plan" board with columns
  const marketingPlan = await prisma.board.create({
    data: {
      title: 'Marketing Plan',
      description: 'Marketing strategy and execution',
      columns: {
        create: [
          { name: 'TODO', order: 0, color: '#49c4e5' },
          { name: 'DOING', order: 1, color: '#635fc7' },
          { name: 'DONE', order: 2, color: '#67e2ae' },
        ],
      },
    },
    include: { columns: true },
  });

  const mktTodoCol = marketingPlan.columns.find((c) => c.name === 'TODO')!;
  const mktDoingCol = marketingPlan.columns.find((c) => c.name === 'DOING')!;

  await prisma.task.createMany({
    data: [
      {
        title: 'Plan Product Hunt launch',
        description: 'Prepare for Product Hunt launch',
        statusId: mktTodoCol.id,
        boardId: marketingPlan.id,
        order: 0,
      },
      {
        title: 'Share on Show HN',
        description: 'Post on Hacker News',
        statusId: mktTodoCol.id,
        boardId: marketingPlan.id,
        order: 1,
      },
      {
        title: 'Write launch article to publish on multiple channels',
        description: 'Create launch announcement',
        statusId: mktDoingCol.id,
        boardId: marketingPlan.id,
        order: 0,
      },
    ],
  });

  // Create "Roadmap" board with columns
  const roadmap = await prisma.board.create({
    data: {
      title: 'Roadmap',
      description: 'Product roadmap and future features',
      columns: {
        create: [
          { name: 'TODO', order: 0, color: '#49c4e5' },
          { name: 'DOING', order: 1, color: '#635fc7' },
          { name: 'DONE', order: 2, color: '#67e2ae' },
        ],
      },
    },
    include: { columns: true },
  });

  const roadmapTodoCol = roadmap.columns.find((c) => c.name === 'TODO')!;

  await prisma.task.createMany({
    data: [
      {
        title: 'Launch version one',
        description: 'MVP release',
        statusId: roadmapTodoCol.id,
        boardId: roadmap.id,
        order: 0,
      },
      {
        title: 'Review early feedback and plan next steps',
        description: 'Gather and analyze user feedback',
        statusId: roadmapTodoCol.id,
        boardId: roadmap.id,
        order: 1,
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log(`Created boards: ${platformLaunch.title}, ${marketingPlan.title}, ${roadmap.title}`);
  console.log('Each board has custom status columns: TODO, DOING, DONE');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
