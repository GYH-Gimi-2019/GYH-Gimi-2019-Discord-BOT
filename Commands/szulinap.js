module.exports = {
    name: 'szulinap',
    description: 'sends DM of arg\'s birthday',
    admin : false,
    roles : [],
    guilds : [],
    async execute(interaction, users, bot, opts){
        const Discord = require('discord.js');
        let user;
        let date;

        let args;
        const subcommandGroup = opts.getSubcommandGroup(false);
        const subcommand = opts.getSubcommand();

        if (subcommandGroup) {
            switch (subcommandGroup) {
                case "név":
                    args = {
                        nev: opts.getString('név')
                    }
					user = users.USERS.find(u => u.NICKNAME === args.nev);
                    break;
            }
        } else {
            switch (subcommand) {
                case "tag":
                    args = {
                        tag: opts.getUser('tag')
                    }
					console.log(args.tag)
                    user = users.USERS.find(u => u.USER_ID === args.tag.id);
                    break;
                case "lista":
                    args = {
                        rendezes: opts.getString('rendezés')
                    }
                    let allBD = [];
					users.USERS.forEach(u => {
						if (u.REAL) {
							allBD.push({
                                "NAME": u.NICKNAME,
                                "DATE": new Date(u.BIRTHDAY.YEAR, u.BIRTHDAY.MONTH - 1, u.BIRTHDAY.DAY, 0, 0, 0, 0)
                            });
						}
					});
                    for (let i = 0; i < allBD.length; ++i) {
                        if (allBD[i] === undefined) allBD.splice(i, 1);
                    }
                    const sortedBD = allBD.sort(
                        /**
                         * @param {string} a.NAME
                         * @param {Date} a.DATE
                         * @param {string} b.NAME
                         * @param {Date} b.DATE
                         * @return {number}
                         */
                        function (a, b) {
							switch (args.rendezes) {
								case "abc":
									return a.NAME.localeCompare(b.NAME, 'hu');
								case "datum":
									switch (a.DATE - b.DATE) {
										case 0:
											return a.NAME.localeCompare(b.NAME, 'hu');
										default:
											return a.DATE - b.DATE;

									}
								case "nap":
									switch (new Date(a.DATE).setFullYear(0) - new Date(b.DATE).setFullYear(0)) {
										case 0:
											switch (a.DATE - b.DATE) {
												case 0:
													return a.NAME.localeCompare(b.NAME, 'hu');
												default:
													return a.DATE - b.DATE;
											}
										default:
											return new Date(a.DATE).setFullYear(0) - new Date(b.DATE).setFullYear(0);
									}
							}
						}
					);
                    let BDstring = "";
                    sortedBD.forEach((e, i) => {
                        BDstring += `\`${i + 1 < 10 ? " " : ""}${i + 1}.\` **${e.NAME}**: <t:${e.DATE / 1000}:D>/* — *kövi: ${getAge(e.DATE) + 1}. <t:${new Date(e.DATE).setFullYear(0) > new Date().setFullYear(0) ? new Date(e.DATE).setFullYear(new Date().getFullYear()) / 1000 : new Date(e.DATE).setFullYear(new Date().getFullYear() + 1) / 1000}:R>**/\n`;
                    });
                    const Embed = new Discord.MessageEmbed()
                        .setTitle("Születésnapok")
						.setAuthor(`${sortBy()} szerint rendezve`)
                        .setDescription(BDstring)
                        .setColor('RANDOM');
                    interaction.reply({embeds: [Embed]});
                    return;
            }
        }
        if (user) {
            interaction.reply({content: `${user.NICKNAME} születésnapja: <t:${new Date(user.BIRTHDAY.YEAR, user.BIRTHDAY.MONTH - 1, user.BIRTHDAY.DAY, 0, 0, 0, 0)/1000}:D> — *kövi: ${getAge(new Date(user.BIRTHDAY.YEAR, user.BIRTHDAY.MONTH - 1, user.BIRTHDAY.DAY, 0, 0, 0, 0)) + 1}. <t:${new Date(user.BIRTHDAY.YEAR, user.BIRTHDAY.MONTH - 1, user.BIRTHDAY.DAY, 0, 0, 0, 0).setFullYear(0) > new Date().setFullYear(0) ? new Date(user.BIRTHDAY.YEAR, user.BIRTHDAY.MONTH - 1, user.BIRTHDAY.DAY, 0, 0, 0, 0).setFullYear(new Date().getFullYear()) / 1000 : new Date(user.BIRTHDAY.YEAR, user.BIRTHDAY.MONTH - 1, user.BIRTHDAY.DAY, 0, 0, 0, 0).setFullYear(new Date().getFullYear() + 1) / 1000}:R>*`, ephemeral: true});
        } else {
            interaction.reply({content: "Érvénytelen paraméter!", ephemeral: true});
        }
        function sortBy() {
            switch (args.rendezes) {
                case "abc":
                    return "Név";
                case "datum":
                    return "Születési dátum";
                case "nap":
                    return "Születésnap";
            }
        }

        /**
         *
         * @param {Date} birthday
         * @return {number}
         */
        function getAge(birthday) {
            const now = new Date();
            if (now.getMonth() + 1 >= birthday.getMonth() + 1) {
                if (now.getDate() >= birthday.getDate()) {
                    return now.getFullYear() - birthday.getFullYear()
                } else {
                    return now.getFullYear() - birthday.getFullYear() - 1;
                }
            } else {
                return now.getFullYear() - birthday.getFullYear() - 1;
            }
        }
    }
}
