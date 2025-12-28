const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = process.env.OWNER_EMAIL || 'owner@example.com';
  const name = process.env.OWNER_NAME || 'App Owner';
  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    const passwordHash = await bcrypt.hash(process.env.OWNER_PASSWORD || 'supersecret', 10);
    await prisma.user.create({
      data: { name, email, passwordHash, role: 'owner' },
    });
    console.log('Owner created:', email);
  } else {
    console.log('Owner already exists');
  }
}
main().finally(() => prisma.$disconnect());
