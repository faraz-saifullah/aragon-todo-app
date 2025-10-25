import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.board.deleteMany();

  // Create "Platform Launch" board with tasks
  const platformLaunch = await prisma.board.create({
    data: {
      title: 'Platform Launch',
      description: 'Main platform launch board',
      tasks: {
        create: [
          {
            title: 'Build UI for onboarding flow',
            description: 'Create user-friendly onboarding screens',
            status: 'TODO',
            order: 0,
          },
          {
            title: 'Build UI for search',
            description: 'Implement search functionality',
            status: 'TODO',
            order: 1,
          },
          {
            title: 'Build settings UI',
            description: 'Create settings page',
            status: 'TODO',
            order: 2,
          },
          {
            title: 'QA and test all major user journeys',
            description: 'Complete end-to-end testing',
            status: 'TODO',
            order: 3,
          },
          {
            title: 'Design settings and search pages',
            description: 'Complete design for settings and search',
            status: 'DOING',
            order: 0,
          },
          {
            title: 'Add account management endpoints',
            description: 'Implement account CRUD operations',
            status: 'DOING',
            order: 1,
          },
          {
            title: 'Design onboarding flow',
            description: 'Create onboarding wireframes and mockups',
            status: 'DOING',
            order: 2,
          },
          {
            title: 'Add search endpoints',
            description: 'Implement search API',
            status: 'DOING',
            order: 3,
          },
          {
            title: 'Add authentication endpoints',
            description: 'Implement auth API',
            status: 'DOING',
            order: 4,
          },
          {
            title: 'Research pricing points of various competitors',
            description: 'Market research for pricing strategy',
            status: 'DOING',
            order: 5,
          },
          {
            title: 'Conduct 5 wireframe tests',
            description: 'User testing of wireframes',
            status: 'DONE',
            order: 0,
          },
          {
            title: 'Create wireframe prototype',
            description: 'High-fidelity prototype',
            status: 'DONE',
            order: 1,
          },
          {
            title: 'Review results of usability tests and iterate',
            description: 'Incorporate user feedback',
            status: 'DONE',
            order: 2,
          },
          {
            title: 'Create paper prototypes and conduct 10 usability tests',
            description: 'Early stage user testing',
            status: 'DONE',
            order: 3,
          },
          {
            title: 'Market discovery',
            description: 'Research target market',
            status: 'DONE',
            order: 4,
          },
          {
            title: 'Competitor analysis',
            description: 'Analyze competitor landscape',
            status: 'DONE',
            order: 5,
          },
          {
            title: 'Research the market',
            description: 'Deep market research',
            status: 'DONE',
            order: 6,
          },
        ],
      },
    },
  });

  // Create "Marketing Plan" board
  const marketingPlan = await prisma.board.create({
    data: {
      title: 'Marketing Plan',
      description: 'Marketing strategy and execution',
      tasks: {
        create: [
          {
            title: 'Plan Product Hunt launch',
            description: 'Prepare for Product Hunt launch',
            status: 'TODO',
            order: 0,
          },
          {
            title: 'Share on Show HN',
            description: 'Post on Hacker News',
            status: 'TODO',
            order: 1,
          },
          {
            title: 'Write launch article to publish on multiple channels',
            description: 'Create launch announcement',
            status: 'DOING',
            order: 0,
          },
        ],
      },
    },
  });

  // Create "Roadmap" board
  const roadmap = await prisma.board.create({
    data: {
      title: 'Roadmap',
      description: 'Product roadmap and future features',
      tasks: {
        create: [
          {
            title: 'Launch version one',
            description: 'MVP release',
            status: 'TODO',
            order: 0,
          },
          {
            title: 'Review early feedback and plan next steps',
            description: 'Gather and analyze user feedback',
            status: 'TODO',
            order: 1,
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log(`Created boards: ${platformLaunch.title}, ${marketingPlan.title}, ${roadmap.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
