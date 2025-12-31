require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash(process.env.OWNER_PASSWORD, 10);

  await prisma.user.update({
    where: { email: process.env.OWNER_EMAIL },
    data: { passwordHash: hash }
  });

  console.log("Owner password updated successfully!");
}

main()
  .catch((e) => {
    console.error("Error updating owner password:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
