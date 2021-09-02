const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'classroom-meet',
    description: 'writes out the link of the requested lesson\'s Google Classroom or Google Meet link',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, opts, users, timetable, bot, command) {
        let link;
        let user;
        let userNum;
        const row = new Discord.MessageActionRow();
        const subcommand = opts.getSubcommand();
        let args = {
            user: opts.get('user')
        }
        switch (subcommand) {
            case "tantárgy":
                args.tantargy = opts.get('tantárgy');
                let subject;
                let db;
                userNum = args.user ? ` (user ${args.user.value})` : "";
                const subject_arr = args.tantargy.value.split(" ");
                switch (command) {
                    case "classroom":
                        db = timetable.CLASSROOM;
                        user = args.user ? `/u/${args.user.value}` : "";
                        break;
                    case "meet":
                        db = timetable.MEET;
                        user = args.user ? `?authuser=${args.user.value}` : "";
                        break;
                    default:return;
                }
                /*Object.keys(db).reduce((acc, key) => {
                    console.log(acc);
                    if (acc === subject_arr[0]) {
                        subject = acc;
                        link = db[acc];
                    }
                    return key;
                });*/
                subject = subject_arr[0];
                link = db[subject];
                if (typeof link === 'object') {
                    switch (subject_arr[subject_arr.length - 1]) {
                        case "fiúk":
                            link = link.BOYS;
                            subject += " (fiúk)";
                            break;
                        case "lányok":
                            link = link.GIRLS;
                            subject += " (lányok)";
                            break;
                        case "sárgák":
                            link = link.G1;
                            subject += " (sárgák)";
                            break;
                        case "lilák":
                            link = link.G2;
                            subject += " (lilák)";
                            break;
                        case "közös":
                            link = link.MAIN;
                            subject += " (közös)";
                            break;
                    }
                }
                switch (command) {
                    case "classroom":
                        link = `https://classroom.google.com${user}/c/${link}`
                        break;
                    case "meet":
                        link = `https://meet.google.com/lookup/${link}${user}`
                        break;
                    default:return;
                }
                row.addComponents(
                    new Discord.MessageButton()
                        .setLabel("Vezess Oda!")
                        .setStyle("LINK")
                        .setURL(link)
                );
                interaction.reply({content: `**${subject} ${command.charAt(0).toUpperCase() + command.slice(1)} linkje${userNum}**`, components: [row]});
                break;
            default:
                switch (command) {
                    case "classroom":
                        switch (subcommand) {
                            case "teendő":
                                args.tipus = opts.get('típus');
                                userNum = args.user ? ` (user ${args.user.value})` : "";
                                user = args.user ? `/u/${args.user.value}/` : "/";
                                switch (args.tipus.value) {
                                    case "Kiosztva":
                                        link = `https://classroom.google.com${user}a/not-turned-in/all`;
                                        break;
                                    case "Hiányzik":
                                        link = `https://classroom.google.com${user}a/missing/all`;
                                        break;
                                    case "Kész":
                                        link = `https://classroom.google.com${user}a/turned-in/all`;
                                        break;
                                }
                                row.addComponents(
                                    new Discord.MessageButton()
                                        .setLabel("Vezess Oda!")
                                        .setStyle("LINK")
                                        .setURL(link)
                                );
                                interaction.reply({content: `**Teendők ${args.tipus.value} linkje${userNum}**`, components: [row]});
                                break;
                        }
                        break;
                    case "meet":
                        switch (subcommand) {
                            case "új":
                                userNum = args.user ? ` (user ${args.user.value})` : "";
                                user = args.user ? `?authuser=${args.user.value}` : "";
                                row.addComponents(
                                    new Discord.MessageButton()
                                        .setLabel("Vezess Oda!")
                                        .setStyle("LINK")
                                        .setURL(`https://meet.google.com/new${user}`)
                                );
                                interaction.reply({content: `**Link az új meeting-hez${userNum}**`, components: [row]});
                                break;
                        }
                        break;
                }
        }
    }
}
