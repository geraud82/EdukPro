const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚠️ Clearing database...');

  await prisma.$transaction([
    // 🔥 LEAF TABLES
    prisma.payment.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.message.deleteMany(),

    // 🔼 DOMAIN DATA
    prisma.student.deleteMany(),
    prisma.class.deleteMany(),
    prisma.fee.deleteMany(),

    // 🔼 CORE ENTITIES
    prisma.school.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✅ Database cleared successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error clearing DB:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
