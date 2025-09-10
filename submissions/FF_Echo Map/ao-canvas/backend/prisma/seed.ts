import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { handle: 'demo' },
    update: {},
    create: {
      handle: 'demo',
      email: 'demo@example.com',
      wallet: {
        chain: 'ethereum',
        address: '0x1234567890123456789012345678901234567890',
      },
      prefs: {
        locale: 'en',
        theme: 'light',
      },
    },
  });

  // Create a demo session
  const session = await prisma.session.upsert({
    where: { id: 'demo-session' },
    update: {},
    create: {
      id: 'demo-session',
      userId: user.id,
      title: 'AI Ethics Debate Demo',
    },
  });

  // Create demo roles
  const role1 = await prisma.role.upsert({
    where: { id: 'demo-role-1' },
    update: {},
    create: {
      id: 'demo-role-1',
      sessionId: session.id,
      name: 'Rational Analyst',
      persona: 'A logical, data-driven analyst who supports AI advancement and believes in the benefits of human-AI collaboration.',
      params: {
        model: 'gpt-4',
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
      },
    },
  });

  const role2 = await prisma.role.upsert({
    where: { id: 'demo-role-2' },
    update: {},
    create: {
      id: 'demo-role-2',
      sessionId: session.id,
      name: 'Humanist Critic',
      persona: 'A thoughtful critic who values human uniqueness and is concerned about the potential negative impacts of AI on society.',
      params: {
        model: 'gpt-4',
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 1000,
      },
    },
  });

  // Create demo canvas nodes
  const ideaNode = await prisma.canvasNode.upsert({
    where: { id: 'demo-idea-node' },
    update: {},
    create: {
      id: 'demo-idea-node',
      sessionId: session.id,
      kind: 'idea',
      title: 'AI Ethics in Healthcare',
      contentRef: {
        type: 'idea',
        text: 'Should AI be used to make life-or-death decisions in healthcare?',
      },
      x: 0,
      y: 0,
      layout: {
        w: 200,
        h: 100,
        color: '#e3f2fd',
      },
    },
  });

  // Update session with root node
  await prisma.session.update({
    where: { id: session.id },
    data: { rootNodeId: ideaNode.id },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Demo user: ${user.handle} (${user.email})`);
  console.log(`📝 Demo session: ${session.title}`);
  console.log(`🎭 Demo roles: ${role1.name}, ${role2.name}`);
  console.log(`💡 Demo idea: ${ideaNode.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
