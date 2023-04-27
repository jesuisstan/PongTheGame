"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const achievement_1 = require("./achievement");
const user_1 = require("./user");
const chat_1 = require("./chat");
exports.prisma = new client_1.PrismaClient();
async function main() {
    await exports.prisma.$connect();
    const size = (await exports.prisma.achievement.findMany({
        select: {
            id: true,
        },
    })).length;
    if (size == 0) {
        console.log(`Start seeding ...`);
        (0, achievement_1.insert_achievement)();
        (0, user_1.insert_AI)();
        (0, chat_1.insert_General)();
        console.log(`Seeding finished.`);
    }
    else {
        console.log(`Seed not needed.`);
    }
}
main()
    .then(async () => {
    await exports.prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await exports.prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map