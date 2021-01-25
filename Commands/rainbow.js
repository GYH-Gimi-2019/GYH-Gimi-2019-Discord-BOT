const Discord = require('discord.js');

module.exports = {
    name: 'rainbow',
    description: 'changes the author\'s personal role\'s colour',
    admin : true,
    roles : [],
    guilds : [],
    execute(message, args, users) {
        const role = message.guild.roles.cache.find(r => r.id === users.USERS[0].ROLE_ID);
        const color = role.color.toString(16);
        console.log(color);
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].USER_ID === message.member.user.id) {
                for (let i = 0; i < 360; i++) {
                    rgb = HSVtoRGB(i / 360, 1, 1);
                    role.edit({color: rgbToHex(rgb.r, rgb.g, rgb.b)});
                }
            }
        }
        role.edit({color: color})

        function HSVtoRGB(h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }

        function rgbToHex(r, g, b) {
            return componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function componentToHex(c) {
            let hex = Number(c).toString(16);
            console.log(hex);
            return hex.length === 1 ? "0" + hex : hex;
        }
    }
}