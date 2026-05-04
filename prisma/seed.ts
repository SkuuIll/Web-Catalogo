import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@showroom.com' },
    update: {},
    create: {
      email: 'admin@showroom.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  })

  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'SHOWROOM JR',
    },
  })

  console.log({ admin, config })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
