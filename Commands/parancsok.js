const Discord = require('discord.js');

module.exports = {
    name: 'parancsok',
    description: 'writes out the commands',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, opts, users, commands, prefix, bot, database, slash_commands, setup) {
        let value = "";
        let blank = 0;
        let rand;
        let args;
        let commandList = [];
        let Embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp();
        if (interaction.isCommand()) {
            args = {
                parancs: opts.get('parancs')
            };
        } else if (interaction.isSelectMenu()) {
            args = {
                parancs: {
                    value: opts[0]
                }
            };
        }

        const subjects = ["Angol közös", "Angol sárgák", "Angol lilák", "Biosz", "Fizika", "Föci", "Francia", "Info sárgák", "Info lilák", "Kémia", "Kommunikáció", "Matek", "Német", "Osztályidő", "Tesi fiúk", "Tesi lányok", "Töri"];
        const team_opts = ["sárgák", "lilák", "német", "francia", "tesi fiúk", "tesi lányok"]
        if (args.parancs) {
            Embed
                .setTitle(`\`${args.parancs.value}\` parancs leírása:`)
                .setDescription(`\`[]\`, \`()\` = általad meghatározott érték. Ezeket a paraméterekkel NE írd be!\nHa a szerverbe írod, akkor kell a parancs elé egy \`/\` is, de DM-nél enélkül kell!\n\`[]\` = kötelező, \`()\` = nem kötelező`)
            for (let i = 0; i < commands.MAIN.length; i++) {
                if (args.parancs.value === commands.MAIN[i].name.split(" ")[0] && commands.MAIN[i].command) {
                    replace(i);
                }
            }
            interaction.reply({embeds: [Embed]});
        } else {
            let command_arr = [];
            Embed
                .setTitle('A parancsok, amiket tudsz használni')
                .setDescription(`A felső a parancs neve, az alsó pedig a típusa.\nA _\`slash\`_ típusú parancsoknál az előtag a(z) \`/\`. Az _\`üzenet\`_ típusú parancsoknál az előtag a(z) \`${prefix}\`, de ha DM-ben használod, akkor nincs előtag.\nBővebb leírásért válaszd ki a kívánk parancsot a legördülő menüből!`)
            commandListAdd("MAIN");
            commands.MAIN.forEach(c => {
                if (c.display && !command_arr.includes(c.name.split(' ')[0])) {
                    command_arr.push(c.name.split(' ')[0]);
                    if (c.command) {
                        if (c.done) {
                            blank++
                            Embed.addField(`**${c.name.split(' ')[0]}**`, `típus: _\`${c.type}\`_`, true);
                        } else {
                            Embed.addField(`**${c.name.split(' ')[0]}**`, c.value, true);
                        }
                    } else {
                        if ((blank - 2) % 3 === 0) Embed.addField('\u200B', '\u200B', true);
                        blank = 0;
                        Embed.addField(c.name, c.value);
                    }
                }
            })

            let row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('help')
                        .setPlaceholder('Válassz egy parancsot!')
                        .addOptions(commandList)
                );
            interaction.reply({embeds: [Embed], components: [row]});
        }

        function replace(i) {
            value = commands.MAIN[i].value;
            const wd = ["hétfő", "kedd", "szerda", "csütörtök", "péntek"]
            let usrs = [];
            let usr;
            switch (commands.MAIN[i].name) {
                case "msg [címzett] [üzenet]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && bot.guilds.cache.get(interaction.guildId).members.cache.get(user.USER_ID)) {
                            usrs.push(user.USER_ID);
                        }
                    }
                    usr = bot.guilds.cache.get(interaction.guildId).members.cache.get(usrs[random(usrs.length)]);
                    valueReplace(1, usr.nickname ? usr.nickname : usr.username);
                    break;
                case "szulinap név fiú [név]": case "email név fiú [név]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && user.GENDER === "M" && bot.guilds.cache.get(interaction.guildId).members.cache.get(user.USER_ID)) {
                            usrs.push(user.NICKNAME);
                        }
                    }
                    valueReplace(1, usrs[random(usrs.length)]);
                    break;
                case "szulinap név lány [név]": case "email név lány [név]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && user.GENDER === "F" && bot.guilds.cache.get(interaction.guildId).members.cache.get(user.USER_ID)) {
                            usrs.push(user.NICKNAME);
                        }
                    }
                    valueReplace(1, usrs[random(usrs.length)]);
                    break;
                case "email név tanár [név]":
                    const teachers = ["Ági", "Ancsa", "Betti", "Chris", "Dóri", "Emese", "Fruzsi", "Gólya Orsi", "György", "Juli", "Kristóf", "Laza Orsi", "Melinda", "Vili", "Zsuzsi"]
                    valueReplace(1, teachers[random(teachers.length)]);
                    break;
                case "szulinap tag [tag]": case "email tag [tag]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && bot.guilds.cache.get(interaction.guildId).members.cache.get(user.USER_ID)) {
                            usrs.push(user.USER_ID);
                        }
                    }
                    usr = bot.guilds.cache.get(interaction.guildId).members.cache.get(usrs[random(usrs.length)]);
                    valueReplace(1, usr.nickname ? usr.nickname : usr.username);
                    break;
                case "szulinap lista [rendezés]":
                    valueReplace(1, Boolean(random(2)) ? "abc" : "datum");
                    break;
                case "bejonni [szám]": case "laptop [alkalom]":
                    valueReplace(100, random(100) + 1);
                    break;
                case "orak dátum [év] [hónap] [nap]":
                    valueReplace(1, new Date().getFullYear());
                    valueReplace(2, new Date().getMonth() + 1);
                    valueReplace(3, new Date().getDate());
                    break;

                case "orak múlva [nap] (hét)":
                    valueReplace(100, random(100) + 1);
                    valueReplace(101, random(100) + 1);
                    valueReplace(102, random(100) + 1);
                    break;
                case "orak hét [nap] (hét)":
                    valueReplace(102, random(100) + 1);
                    valueReplace(100, wd[random(wd.length)]);
                    valueReplace(101, wd[random(wd.length)]);
                    break;
                case "csapat [darab] (csoport)":
                    valueReplace(15, random(12) + 1);
                    valueReplace(16, random(12) + 1);
                    valueReplace(1, team_opts[random(team_opts.length)]);
                    break;
                case "szin hex [hex] (teszt)":
                    valueReplace(1, random(0xffffff+1).toString(16));
                    valueReplace(2, random(0xffffff+1).toString(16));
                    valueReplace(3, Boolean(random(2)) ? "True" : "False");
                    valueReplace(4, Boolean(random(2)) ? "True" : "False");
                    break;
                case "szin rgb [R] [G] [B] (teszt)":
                    valueReplace(1, random(256));
                    valueReplace(2, random(256));
                    valueReplace(3, random(256));
                    valueReplace(4, Boolean(random(2)) ? "True" : "False");

                    break;
                case "szin név [név] (teszt)":
                    //const discord_colours = ["DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "YELLOW", "PURPLE", "LUMINOUS_VIVID_PINK", "GOLD", "ORANGE", "RED", "GREY", "DARKER_GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_GOLD", "DARK_ORANGE", "DARK_RED", "DARK_GREY", "LIGHT_GREY", "DARK_NAVY", "BLURPLE", "GREYPLE", "DARK_BUT_NOT_BLACK", "NOT_QUITE_BLACK", "RANDOM"];
                    let discord_colours = [];
                    for (const [key, value] of Object.entries(require("../node_modules/discord.js/src/util/Constants").Colors)) {discord_colours.push(key);}
                    let colours = [];
                    for (const c of database.COLOURS) {
                        colours.push(c.NAME);
                    }
                    valueReplace(1, Boolean(random(2)) ? discord_colours[random(discord_colours.length)] : colours[random(colours.length)]);
                    valueReplace(2, Boolean(random(2)) ? "True" : "False");
                    break;
                case "nev [rendezés]":
                    let name;
                    switch (random(3)) {
                        case 0:
                            name = "becenév";
                            break;
                        case 1:
                            name = "keresztnév";
                            break;
                        case 2:
                            name = "vezetéknév"
                            break;
                    }
                    valueReplace(1, name);
                    break;
                case "classroom tantárgy [tantárgy] (user)": case "meet tantárgy [tantárgy] (user)":
                    valueReplace(1, subjects[random(subjects.length)]);
                    valueReplace(2, subjects[random(subjects.length)]);
                    valueReplace(3, random(6));
                    break;
                case "classroom teendő [típus] (user)":
                    const types = ["Kiosztva", "Hiányzik", "Kész"]
                    valueReplace(1, types[random(types.length)]);
                    valueReplace(2, types[random(types.length)]);
                    valueReplace(3, random(6));
                    break;
                case "meet új (user)": case "drive (user)": case "jon (user)": case "most (user)":
                    valueReplace(1, random(6));
                    break;
                case "meeten (csoport)": case "parok (csoport)": case "sorrend (csoport)":
                    valueReplace(1, team_opts[random(team_opts.length)])
                    break;

            }
            Embed.addField((commands.MAIN[i].command ? `**\`${commands.MAIN[i].name}\`**` : commands.MAIN[i].name), value);
            function valueReplace(from, to) {
                value = value.replace(`{replace${from}}`, to);
            }

            function random(max) {
                return Math.floor(Math.random() * max);
            }
        }

        function idByNickname(name) {
            for (const raw of users.USERS) {
                if (name === raw.NICKNAME) {
                    return raw.USER_ID;
                }
            }
        }

        function genderById(id) {
            for (const raw of users.USERS) {
                if (id === raw.USER_ID) {
                    return raw.GENDER;
                }
            }
        }

        function groupById(id) {
            for (const raw of users.USERS) {
                if (id === raw.USER_ID) {
                    return raw.SUBJECTS.GROUPS;
                }
            }
        }

        /**
         *
         * @param {("MAIN"|"ADMIN")} type
         */
        function commandListAdd(type) {
            slash_commands[type].find(c => c.name === setup.HELP_COMMAND).options.find(o => o.name === "parancs").choices.forEach(c => {
                const commandObject = {
                    label: c.name,
                    description: slash_commands[type].find(com => com.name === c.name).description,
                    value: c.value
                }
                commandList.push(commandObject);
            })
        }
    }
}
