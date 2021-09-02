const Discord = require('discord.js');

module.exports = {
    name: 'laptop',
    description: 'writes out the next x times when the author has to bring your laptop to school',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, opts, users, timetable, bot) {
        const args = {
            alkalom: opts.get('alkalom')
        }

        if (args.alkalom.value > 100 || args.alkalom.value < 1) {
            interaction.reply({content: "Érvénytelen paraméter!", ephemeral: true});
            return;
        }

        let id;
        let groups;
        for (user of users.USERS) {
            if (user.USER_ID === interaction.member.user.id) {
                id = user.USER_ID;
                groups = user.SUBJECTS.GROUPS;
                break;
            }
        }

        let count = 0;
        let date = new Date();
        const week = timetable.WEEK.ENG_IT;
        let day;
        let dates = "";
        
        while (args.alkalom.value > count) {
            day = whichDay();
            if (day) {
                dates += `${date.getFullYear()}. ${date.getMonth()+1 < 10 ? "0" : ""}${date.getMonth()+1}. ${date.getDate() < 10 ? "0" : ""}${date.getDate()}. ${date.getDay() === 2 ? "Kedd" : "Hétfő"}\n`
            }
            date.setDate(date.getDate()+1);
        }

        const Embed = new Discord.MessageEmbed()
        .setTitle(`A következő ${args.alkalom.value} alkalom, mikor be kell hoznod a laptopod (${groups === 1 ? "sárgák" : "pirosak/lilák"})`)
        .setDescription(dates)
        .setColor('RANDOM');
        interaction.reply({embeds: [Embed]});

        function getWeekNumber(d) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        }

        function whichDay() {
            if (getWeekNumber(date) % 2 === week) {
                if (date.getDay() === 2) {
                    if (groups === 1) {
                        count++
                        return date;
                    }
                } else if (date.getDay() === 1) {
                    if (groups === 2) {
                        count++
                        return date;
                    }
                }
            } else {
                if (date.getDay() === 1) {
                    if (groups === 1) {
                        count++
                        return date;
                    }
                } else if (date.getDay() === 2) {
                    if (groups === 2) {
                        count++
                        return date;
                    }
                }
            }
        }
    }
}
