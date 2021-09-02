const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'verify',
    description: 'for the verify channel',
    admin : true,
    roles : [],
    guilds : [],
    async execute(message, args, setup, bot){
        let title = "";
        let description = "";
        let argsSuccess = false;
        let inJSON;
        let msgId;
        let row;
        const path = "../database/setup.json";
            switch (args[1]) {
                case "intro":
                    inJSON = "Intro";
                    title = "Ezek érdekelnek";
                    description = "**Itt vannak azok a kategóriák és a hozzájuk tartozó csatornák, amik a lenn lévő opcióknál vannak.**\n\n__Amelyik kategóriák érdekelnek, válaszd ki az alsó legördülő menüből! Ha esetleg nem érdekel többé az egyik kategória, azt a menüben újra kiválasztva tudod deaktiválni.__";
                    argsSuccess = true;
                    break;
                case "rules":
                    inJSON = "Rules";
                    title = "Ha elolvastad, és elfogadod az itt leírtakat";
                    description = `**menj be a ${getChannel(setup.ROLES.Verified.CHANNEL_ID)} csatornába (vagy nyomj rá a \`#verify\`-ra!)**`;
                    argsSuccess = true;
                    break;
                case "bot":
                    inJSON ="BOT";
                    title = "BOT";
                    description = `
${print(setup.REACTION_CHANNELS.BOT.boxbot_szoba)} 
${print(setup.REACTION_CHANNELS.BOT.idlerpg_szoba)}
${print(setup.REACTION_CHANNELS.BOT.pokecord)}
${print(setup.REACTION_CHANNELS.BOT.cleverbot)}
                    `;
                    argsSuccess = true;
                    break;
                case "gaming":
                    inJSON = "Gaming";
                    title = "Gaming";
                    description = `
${print(setup.REACTION_CHANNELS.Gaming.gaming_erdekel)}
${print(setup.REACTION_CHANNELS.Gaming.gaming_zene)}
${print(setup.REACTION_CHANNELS.Gaming.minecraft, true)}
${print(setup.REACTION_CHANNELS.Gaming.among_us, true)}
${print(setup.REACTION_CHANNELS.Gaming.rocket_league, true)}
${print(setup.REACTION_CHANNELS.Gaming.paladins, true)}
${print(setup.REACTION_CHANNELS.Gaming.pubg, true)}
${print(setup.REACTION_CHANNELS.Gaming.csgo, true)}
${print(setup.REACTION_CHANNELS.Gaming.r6s, true)}
${print(setup.REACTION_CHANNELS.Gaming.fortnite, true)}
${print(setup.REACTION_CHANNELS.Gaming.ark, true)}
${print(setup.REACTION_CHANNELS.Gaming.fall_guys, true)}
${print(setup.REACTION_CHANNELS.Gaming.gta, true)}
${print(setup.REACTION_CHANNELS.Gaming.league_of_legends, true)}
${print(setup.REACTION_CHANNELS.Gaming.lego, true)}
${print(setup.REACTION_CHANNELS.Gaming.sim_racing, true)}
${print(setup.REACTION_CHANNELS.Gaming.valorant, true)}
${print(setup.REACTION_CHANNELS.Gaming.phasmophobia, true)}
:loud_sound: #1
:loud_sound: #2
:loud_sound: #3
:loud_sound: #4
                    `;
                    argsSuccess = true;
                    break;
                case "zene":
                    inJSON = "Zene";
                    title = "Zene";
                    description = `
${print(setup.REACTION_CHANNELS.Zene.zene)}
${print(setup.REACTION_CHANNELS.Zene.stream_zene_linkek)}
:loud_sound: Zene hallgatós csatorna
:loud_sound: Rádió hallgatós csatorna
                    `;
                    argsSuccess = true;
                    break;
                case "teszter":
                    inJSON = "Teszter";
                    title = "Teszter";
                    description = `
${print(setup.REACTION_CHANNELS.Teszter.teszter)}
${print(setup.REACTION_CHANNELS.BOT.bot_info)}
${print(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas)}
${print(setup.REACTION_CHANNELS.BOT.discord_js_update)}
${print(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update)}
__A tesztereknek az a feladatuk, hogy leteszteljék az új BOT-okat és az új fejlesztéseket, ami elvárás feléjük!__
                    `;
                    argsSuccess = true;
                    break;
                case "spam":
                    inJSON = "Spam";
                    title = "Spam";
                    description = `
${print(setup.REACTION_CHANNELS.Spam.one_word_story_in_english)}
${print(setup.REACTION_CHANNELS.Spam.comment_chat)}
${print(setup.REACTION_CHANNELS.Spam.meme_szekcio)}
${print(setup.REACTION_CHANNELS.Spam.null_width_space)}
                    `;
                    argsSuccess = true;
                    break;
                case "programozas":
                    inJSON ="Programozas";
                    title = "Programozás";
                    description = `
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.programozas_erdekel)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.windows, true)} 
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.mac, true)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.linux, true)} 
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.git, true)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.web, true)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.c_cpp, true)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.java, true)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.python, true)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.c_sharp, true)}
${print(setup.REACTION_CHANNELS.PROGRAMOZAS.javascript, true)}
:loud_sound: Projekt 1
:loud_sound: Projekt 2
                    `;
                    argsSuccess = true;
                    break;
                case "done":
                    row = [
                        new Discord.MessageActionRow()
                        .addComponents([
                            new Discord.MessageSelectMenu()
                                .setCustomId('interests')
                                .setPlaceholder('Válaszd ki a kategóriá(ka)t!')
                                .setMinValues(0)
                                .setMaxValues(6)
                                .addOptions([
                                    {
                                        label: "BOT",
                                        emoji: setup.ROLES.BOT.REACTION,
                                        value: setup.ROLES.BOT.ROLE_ID
                                    },
                                    {
                                        label: "Gaming",
                                        emoji: setup.ROLES.Gaming.REACTION,
                                        value: setup.ROLES.Gaming.ROLE_ID
                                    },
                                    {
                                        label: "Programozás",
                                        emoji: setup.ROLES.Programozas.REACTION,
                                        value: setup.ROLES.Programozas.ROLE_ID
                                    },
                                    {
                                        label: "Zene",
                                        emoji: setup.ROLES.Zene.REACTION,
                                        value: setup.ROLES.Zene.ROLE_ID
                                    },
                                    {
                                        label: "Spam",
                                        emoji: setup.ROLES.Spam.REACTION,
                                        value: setup.ROLES.Spam.ROLE_ID
                                    },
                                    {
                                        label: "Teszter",
                                        emoji: setup.ROLES.Teszter.REACTION,
                                        value: setup.ROLES.Teszter.ROLE_ID
                                    }
                                ])
                        ]),
                        new Discord.MessageActionRow()
                            .addComponents([
                                new Discord.MessageButton()
                                    .setLabel("Megvagyok nélkülük")
                                    .setStyle(1)
                                    .setCustomId("no_role")
                            ])
                    ]
                    inJSON = "Ezek_erdekelnek";
                    title = "Minden kategóriát kiválasztottál, ami érdekel?";
                    description = "**Ha igen, csak hattints félre! Ha nem akarsz extra csatornákat, akkor csak nyomj rá az alsó gombra!**";
                    argsSuccess = true;
                    break;
                case "verify":
                    row = [
                        new Discord.MessageActionRow()
                        .addComponents([
                            new Discord.MessageButton()
                                .setLabel("Elfogadom")
                                .setStyle(3)
                                .setCustomId("terms_accept"),
                            new Discord.MessageButton()
                                .setLabel("Elutasítom")
                                .setStyle(4)
                                .setCustomId("terms_deny")

                        ])
                    ]
                    inJSON = "Verify";
                    title = `Elfogadod az itt leírtakat?`;
                    description = `**Ha elfogadtad, menj be az ${getChannel(setup.ROLES.Ezek_erdekelnek.CHANNEL_ID)} csatornába!**`;
                    argsSuccess = true;
                    break;
                case "test":
                    inJSON = "Test"
                    title = "Title";
                    description = "Description";
                    argsSuccess = true;
                    break;


                case "iprogramozas":
                    row = [
                        new Discord.MessageActionRow()
                            .addComponents([
                                new Discord.MessageSelectMenu()
                                    .setCustomId('programozas')
                                    .setPlaceholder('Válaszd ki a kategóriá(ka)t!')
                                    .setMinValues(0)
                                    .setMaxValues(10)
                                    .addOptions([
                                        {
                                            label: "Windows",
                                            emoji: setup.ROLES.Programozas.CHANNELS.windows.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.windows.ROLE_ID
                                        },
                                        {
                                            label: "Mac",
                                            emoji: setup.ROLES.Programozas.CHANNELS.mac.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.mac.ROLE_ID
                                        },
                                        {
                                            label: "Linux",
                                            emoji: setup.ROLES.Programozas.CHANNELS.linux.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.linux.ROLE_ID
                                        },
                                        {
                                            label: "Git",
                                            emoji: setup.ROLES.Programozas.CHANNELS.git.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.git.ROLE_ID
                                        },
                                        {
                                            label: "C/C++",
                                            emoji: setup.ROLES.Programozas.CHANNELS.c_cpp.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.c_cpp.ROLE_ID
                                        },
                                        {
                                            label: "Java",
                                            emoji: setup.ROLES.Programozas.CHANNELS.java.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.java.ROLE_ID
                                        },
                                        {
                                            label: "Python",
                                            emoji: setup.ROLES.Programozas.CHANNELS.python.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.python.ROLE_ID
                                        },
                                        {
                                            label: "C#",
                                            emoji: setup.ROLES.Programozas.CHANNELS.c_sharp.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.c_sharp.ROLE_ID
                                        },
                                        {
                                            label: "WEB",
                                            emoji: setup.ROLES.Programozas.CHANNELS.web.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.web.ROLE_ID
                                        },
                                        {
                                            label: "JavaScript",
                                            emoji: setup.ROLES.Programozas.CHANNELS.javascript.EMOTE_ID,
                                            value: setup.ROLES.Programozas.CHANNELS.javascript.ROLE_ID
                                        },

                                    ])
                            ])
                    ]
                    inJSON = "Programozas"
                    title = "Ezek közül melyeket használod?";
                    description = "";
                    for (const [key, value] of Object.entries(setup.ROLES.Programozas.CHANNELS)) {description += `${value.CUSTOM_EMOTE ? bot.emojis.cache.get(value.EMOTE_ID) : value.EMOTE_ID}: ${value.NAME}\n`;}
                    argsSuccess = true;
                    break;
                case "igaming":
                    row = [
                        new Discord.MessageActionRow()
                            .addComponents([
                                new Discord.MessageSelectMenu()
                                    .setCustomId('gaming')
                                    .setPlaceholder('Válaszd ki a kategóriá(ka)t!')
                                    .setMinValues(0)
                                    .setMaxValues(16)
                                    .addOptions([
                                        {
                                            label: "Minecraft",
                                            emoji: setup.ROLES.Gaming.CHANNELS.minecraft.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.minecraft.ROLE_ID
                                        },
                                        {
                                            label: "Paladins",
                                            emoji: setup.ROLES.Gaming.CHANNELS.paladins.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.paladins.ROLE_ID
                                        },
                                        {
                                            label: "Rocket League",
                                            emoji: setup.ROLES.Gaming.CHANNELS.rocket_league.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.rocket_league.ROLE_ID
                                        },
                                        {
                                            label: "PUBG",
                                            emoji: setup.ROLES.Gaming.CHANNELS.pubg.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.pubg.ROLE_ID
                                        },
                                        {
                                            label: "CS:GO",
                                            emoji: setup.ROLES.Gaming.CHANNELS.csgo.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.csgo.ROLE_ID
                                        },
                                        {
                                            label: "R6S",
                                            emoji: setup.ROLES.Gaming.CHANNELS.r6s.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.r6s.ROLE_ID
                                        },
                                        {
                                            label: "Among Us",
                                            emoji: setup.ROLES.Gaming.CHANNELS.among_us.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.among_us.ROLE_ID
                                        },
                                        {
                                            label: "Fortnite",
                                            emoji: setup.ROLES.Gaming.CHANNELS.fortnite.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.fortnite.ROLE_ID
                                        },
                                        {
                                            label: "ARK",
                                            emoji: setup.ROLES.Gaming.CHANNELS.ark.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.ark.ROLE_ID
                                        },
                                        {
                                            label: "Fall Guys",
                                            emoji: setup.ROLES.Gaming.CHANNELS.fall_guys.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.fall_guys.ROLE_ID
                                        },
                                        {
                                            label: "GTA",
                                            emoji: setup.ROLES.Gaming.CHANNELS.gta.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.gta.ROLE_ID
                                        },
{
                                            label: "League of Legends",
                                            emoji: setup.ROLES.Gaming.CHANNELS.league_of_legends.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.league_of_legends.ROLE_ID
                                        },
                                        {
                                            label: "Lego",
                                            emoji: setup.ROLES.Gaming.CHANNELS.lego.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.lego.ROLE_ID
                                        },
                                        {
                                            label: "Sim Racing",
                                            emoji: setup.ROLES.Gaming.CHANNELS.sim_racing.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.sim_racing.ROLE_ID
                                        },
                                        {
                                            label: "Valorant",
                                            emoji: setup.ROLES.Gaming.CHANNELS.valorant.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.valorant.ROLE_ID
                                        },
                                        {
                                            label: "Phasmophobia",
                                            emoji: setup.ROLES.Gaming.CHANNELS.phasmophobia.EMOTE_ID,
                                            value: setup.ROLES.Gaming.CHANNELS.phasmophobia.ROLE_ID
                                        }
                                    ])
                            ])
                    ]
                    inJSON = "Gaming"
                    title = "Ezek közül melyekkel játszol?";
                    description = "";
                    for (const [key, value] of Object.entries(setup.ROLES.Gaming.CHANNELS)) {description += `${value.CUSTOM_EMOTE ? bot.emojis.cache.get(value.EMOTE_ID) : value.EMOTE_ID}: ${value.NAME}\n`;}
                    argsSuccess = true;
                    break;

        }
        if(argsSuccess){
            const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setColor('RANDOM');
            let msgEmbed = await (row ? message.channel.send({embeds: [embed], components: row}) : message.channel.send({embeds: [embed]}));
            /*if (reactEmoji) {
                if (!multiEmoji) {
                    msgEmbed.react(reactEmoji);
                    msgId = setup.ROLES[inJSON].MESSAGE_ID;
                } else {
                    for (const [key, value] of Object.entries(reactEmoji)) {
                        msgEmbed.react(bot.emojis.cache.get(value));
                    }
                    msgId = setup.ROLES[inJSON].CHANNELS_MESSAGE_ID;
                }
            }*/
            await fs.readFile(path, 'utf8', function (err,data) {
            if (err) return console.log(err);
            const result = data.replace(msgId, msgEmbed.id);
            fs.writeFile(path, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
        } else {
            message.channel.send("Érvénytelen paraméter!");
        }

        function getChannel (id) { return message.guild.channels.cache.get(id); }
        function print (path, choosable) {
            return `**${getChannel(path)}**${choosable ? " (választható)" : ""}\n-*${getChannel(path).topic}*`
        }
    }
}
