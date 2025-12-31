const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing OWNER_EMAIL or OWNER_PASSWORD");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    await prisma.user.update({
      where: { email },
      data: { password: hash },
    });
    console.log("✅ Owner UPDATED");
  } else {
    await prisma.user.create({
      data: {
        name: "Owner",
        email,
        password: hash,
        role: "OWNER",
        isActive: true,
      },
    });
    console.log("✅ Owner CREATED");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
