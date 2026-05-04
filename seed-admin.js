const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('JR_admin', 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@showroom.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@showroom.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log("Admin seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
