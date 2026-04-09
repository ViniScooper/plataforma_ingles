import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@test.com' } });
  const p1 = await bcrypt.compare('123', user.password);
  const p2 = await bcrypt.compare('admin123', user.password);
  const p3 = await bcrypt.compare('admin', user.password);
  const p4 = await bcrypt.compare('vini123', user.password);
  console.log('123:', p1);
  console.log('admin123:', p2);
  console.log('admin:', p3);
  console.log('vini123:', p4);
  await prisma.$disconnect();
}
main();
