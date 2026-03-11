const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Rename admin user
  await p.user.update({ where: { id: 1 }, data: { name: 'Admin' } });
  const user = await p.user.findUnique({ where: { id: 1 }, select: { id: true, name: true, role: true } });
  console.log('Updated user 1:', user);

  // Check borrows
  const borrows = await p.borrowRecord.findMany({
    where: { userId: 1 },
    include: { book: { select: { title: true } } },
  });
  console.log('User 1 borrows:');
  borrows.forEach(b => console.log(' -', b.book.title, '| status:', b.status));

  // Count total users now
  const total = await p.user.count();
  console.log('Total users:', total);

  await p.$disconnect();
}

main().catch(console.error);
