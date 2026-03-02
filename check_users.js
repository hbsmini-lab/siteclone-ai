const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, credits: true } });
    console.log(`FOUND ${users.length} USERS`);
    for (const u of users) {
        console.log(`USER: ${u.email} | ID: ${u.id} | ROLE: ${u.role}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
