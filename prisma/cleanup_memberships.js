const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the userId to clean up memberships for: ', async (userId) => {
    userId = Number(userId);
    if (!userId) {
      console.log('Invalid userId.');
      rl.close();
      process.exit(1);
    }
    const memberships = await prisma.communityMembership.findMany({
      where: { userId },
      include: { group: true },
    });
    if (memberships.length === 0) {
      console.log('No memberships found for this user.');
      rl.close();
      process.exit(0);
    }
    console.log('Memberships to be deleted:');
    memberships.forEach(m => {
      console.log(`- Group: ${m.group?.name || m.groupId} (groupId=${m.groupId}) role=${m.role}`);
    });
    rl.question('Are you sure you want to delete these memberships? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        await prisma.communityMembership.deleteMany({ where: { userId } });
        console.log('Memberships deleted.');
      } else {
        console.log('Aborted.');
      }
      rl.close();
      process.exit(0);
    });
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 