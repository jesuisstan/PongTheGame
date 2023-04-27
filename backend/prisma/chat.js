"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert_General = void 0;
const seed_1 = require("./seed");
const bcrypt = require("bcrypt");
async function insert_General() {
    const generateHash = (password) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    };
    console.log('Creation chan General');
    const General = {
        name: 'General',
        owner: 1,
        modes: '',
        password: '',
        userLimit: 0,
    };
    const VIP = {
        name: 'VIP',
        owner: 1,
        modes: 'p',
        password: generateHash('TopSecret'),
        userLimit: 0,
    };
    await seed_1.prisma.chatRoom.create({
        data: General,
    });
    await seed_1.prisma.chatRoom.create({
        data: VIP,
    });
    console.log(`Chat ${General.name}`);
    console.log(`Chat ${VIP.name}`);
}
exports.insert_General = insert_General;
//# sourceMappingURL=chat.js.map