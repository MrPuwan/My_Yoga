import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'abiramy@gmail.com')
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'yoga1234';
  const fullName = (process.env.ADMIN_FULL_NAME || 'Abiramy').trim();

  if (!email || !password || !fullName) {
    throw new Error(
      'ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_FULL_NAME must not be empty.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      fullName,
      email,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log(`Admin account ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((error: unknown) => {
    console.error('Admin seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
