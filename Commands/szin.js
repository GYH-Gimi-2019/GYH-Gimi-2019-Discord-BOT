const Discord = require('discord.js');
const Util = require("../node_modules/discord.js/src/util/Util");

module.exports = {
    name: 'szin',
    description: 'changes the author\'s personal role\'s colour',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, opts, users, database, bot){
        const colours = database.COLOURS;
        const subcommand = opts.getSubcommand();
        let args

        if (interaction.isCommand()) {
            args = {
                teszt: opts.get('teszt')
            }
        } else if (interaction) {
            args = {
                teszt: false
            }
        }

        const row = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton()
                    .setLabel("Beállítás")
                    .setStyle(1)
                    .setCustomId("set_colour")
            ])

        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].USER_ID === interaction.member.user.id) {
                switch (subcommand) {
                    case "név":
                        args.nev = opts.get('név');
                        const custom_colour = isCustomColour(args.nev.value);
                        if (custom_colour) {
                            if (args.teszt.value) {
                                let Embed = new Discord.MessageEmbed()
                                    .setTitle("Szín teszt")
                                    .setDescription(args.nev.value)
                                    .setColor(custom_colour);
                                interaction.reply({embeds: [Embed], components: [row]});
                            } else {
                                setColor(custom_colour);
                                interaction.reply(`A színed átállítva erre: ${args.nev.value}`);
                            }
                        } else if (require("../node_modules/discord.js/src/util/Constants").Colors[args.nev.value.toUpperCase()] || args.nev.value.toUpperCase() === "RANDOM" || args.nev.value.toUpperCase() === "DEFAULT") {
                            setColor(args.nev.value.toUpperCase());
                            interaction.reply(`A színed átállítva erre: ${args.nev.value}`);
                        } else {
                            interaction.reply({content: "Érvénytelen szín!", ephemeral: true});
                        }
                        break;
                    case "hex":
                        args.hex = opts.get('hex');
                        if (new RegExp("^#?([A-Fa-f0-9]{6})$").test(args.hex.value)) {
                            if (args.teszt.value) {
                                let Embed = new Discord.MessageEmbed()
                                    .setTitle("Szín teszt")
                                    .setDescription(args.hex.value)
                                    .setColor(args.hex.value);
                                interaction.reply({embeds: [Embed], components: [row]});
                            } else {
                                setColor(args.hex.value);
                               interaction.reply(`A színed átállítva erre: ${args.hex.value}`);
                            }
                        } else {
                            interaction.reply({content: "Érvénytelen szín!", ephemeral: true});
                        }
                        break;
                    case "rgb":
                        args.r = opts.get('r');
                        args.g = opts.get('g');
                        args.b = opts.get('b');
                        for (const [key, value] of Object.entries(args)) {
                            let colour = value.value;
                            if (["r", "g", "b"].some(str => key === str) && !(0 <= colour && colour <= 255)) {
                                interaction.reply({content: "Érvénytelen szín!", ephemeral: true});
                                return;
                            }

                        }
                        if (args.teszt.value) {
                            let Embed = new Discord.MessageEmbed()
                                .setTitle("Szín teszt")
                                .setDescription(`${args.r.value}, ${args.g.value}, ${args.b.value}`)
                                .setColor(rgbToHex(args.r.value, args.g.value, args.b.value));
                            interaction.reply({embeds: [Embed], components: [row]});

                        } else {
                            setColor(rgbToHex(args.r.value, args.g.value, args.b.value));
                            interaction.reply(`A színed átállítva erre: ${args.r.value}, ${args.g.value}, ${args.b.value}`);
                        }
                        break;
                }

                function setColor(color) {
                    bot.guilds.cache.get(interaction.guildId).roles.cache.find(r => r.id === users.USERS[index].ROLE_ID).edit({color: color});
                }

                function componentToHex(c) {
                    let hex = Number(c).toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                }

                function rgbToHex(r, g, b) {
                    return componentToHex(r) + componentToHex(g) + componentToHex(b);
                }

                function isCustomColour(str) {
                    for (let i = 0; i < colours.length; ++i) {
                        if (str.toUpperCase() === colours[i].NAME.toUpperCase()) return colours[i].HEX;
                    }
                }
            }
        }
    }
}
