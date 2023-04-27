"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert_AI = void 0;
const seed_1 = require("./seed");
async function insert_AI() {
    console.log('Creation AI');
    const AI = {
        nickname: 'AI',
        username: 'Artificial Integlligence',
        profileId: '2023',
        provider: 'AI',
        role: 'ADMIN',
    };
    await seed_1.prisma.user.create({
        data: AI,
    });
    console.log(`User ${AI.nickname}`);
}
exports.insert_AI = insert_AI;
//# sourceMappingURL=user.js.map