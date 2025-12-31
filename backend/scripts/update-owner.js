import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash(process.env.OWNER_PASSWORD, 10);

  await prisma.user.update({
    where: { email: process.env.OWNER_EMAIL },
    data: { password: hash }
  });

  console.log("Owner password updated");
}

main();
