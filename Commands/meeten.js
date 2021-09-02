const Discord = require('discord.js');

module.exports = {
    name: 'meeten',
    description: 'checks if everyone is in a meeting',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, opts, users, database, bot) {
        let names = [];
        let rawNames = [];
        let ind;
        let missing = [];
        let usrIndex = 0;
        let Embed;
        let usr_db = true;
        let userList;
        let messageID;
        const args = {
            csoport: opts.get('csoport')
        }
        for (ind = 0; ind < users.USERS.length; ++ind) {
            if(users.USERS[ind].REAL){rawNames.push(users.USERS[ind]);}
        }
        if (args.csoport) {
            switch (args.csoport.value) {
                case "sárgák":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.GROUPS === 1){names.push(rawNames[ind]);}
                    }
                    break;
                case "lilák":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.GROUPS === 2){names.push(rawNames[ind]);}
                    }
                    break;
                case "német":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.LANGUAGE === "G"){names.push(rawNames[ind]);}
                    }
                    break;
                case "francia":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.LANGUAGE === "F"){names.push(rawNames[ind]);}
                    }
                    break;
                case "tesi fiúk":
                    usr_db = false;
                    names = database.PE.BOYS;
                    break;
                case "tesi lányok":
                    usr_db = false;
                    names = database.PE.GIRLS;
                    break;
            }
        } else {
            names = rawNames;
        }
        if (usr_db) {
            userList = names.sort(function (a, b) {
                let nameA = a.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let nameB = b.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let nameC = a.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let nameD = b.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } if (nameC < nameD) { return -1; } if (nameC > nameD) { return 1; } return 0;
            })
        } else {
            userList = names.sort();
        }
        interaction.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Hiányzók${args.csoport ? ` ${args.csoport.value} ` : " "}meet-en`)
                .setDescription(`✅ - ha itt van az adott osztálytárs\n❌ - ha nincs itt az adott osztálytárs`)
                .setColor('RANDOM')
        ]}).then(() => {
            setTimeout(() => {
                interaction.fetchReply().then((reply) => {
                    reply.react("✅");
                    reply.react("❌");
                    messageID = reply.id;
                    interaction.editReply({embeds: [nextUsrEmbed()]});
        })}, 3000)});

        const listener = (reaction, user) => {
            if (user.id !== bot.user.id && reaction.message.id === messageID && (reaction.emoji.name === "✅" || reaction.emoji.name === "❌")) {
                switch (reaction.emoji.name) {
                    case "✅":
                        ++usrIndex;
                        if (usrIndex === userList.length) {
                            sendMissing(reaction);
                        } else {
                            interaction.editReply({embeds: [nextUsrEmbed()]});
                        }
                        break;
                    case "❌":
                        missing.push(usr_db ? userList[usrIndex++].NICKNAME : userList[usrIndex++]);
                        if (usrIndex === userList.length) {
                            sendMissing(reaction);
                        } else {
                            interaction.editReply({embeds: [nextUsrEmbed()]});
                        }
                        break;
                }
                reaction.users.remove(user.id);
            }
        }

        bot.on('messageReactionAdd', listener);

        function sendMissing (reaction) {
            const rgb = HSVtoRGB((1 - (missing.length / userList.length)) / 3, 1, 1)
            const Embed = new Discord.MessageEmbed()
                .setTitle(missing.length === 0 ? `Úgy tűnik, mindenki benn van${args.csoport ? ` ${args.csoport.value} ` : " "}meet-en` : `Hiányzók${args.csoport ? ` ${args.csoport.value} ` : " "}meet-en:`)
                .setDescription(missing.join("\n"))
                .setColor([rgb.r, rgb.g, rgb.b])
            interaction.editReply({embeds: [Embed]}).then(() => {reaction.message.reactions.cache.forEach(r => {r.remove()})});
            bot.removeListener('messageReactionAdd', listener);
        }

        function nextUsrEmbed () {
            return Embed = new Discord.MessageEmbed()
                .setTitle(`${usr_db ? userList[usrIndex].NICKNAME : userList[usrIndex]} van${args.csoport ? ` ${args.csoport.value} ` : " "}meet-en?`)
                .setDescription(`${usrIndex + 1}/${userList.length}`)
                .setColor(!usr_db || bot.guilds.cache.get(interaction.guildId).roles.cache.get(userList[usrIndex].ROLE_ID).color === 0 ? 'RANDOM' : bot.guilds.cache.get(interaction.guildId).roles.cache.get(userList[usrIndex].ROLE_ID).color);
        }

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
    }
}
