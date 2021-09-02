const Discord = require('discord.js');

module.exports = {
    name: 'email',
    description: 'writes out the email address of the requested teacher or classmate',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, opts, users, database, bot) {
        let ind;
        let email;
        let name;
        const row = new Discord.MessageActionRow();
        const subcommandGroup = opts.getSubcommandGroup(false);
        const subcommand = opts.getSubcommand();
        let args;
        switch (subcommandGroup) {
            case "név":
                args = {
                    nev: opts.get('név')
                }
                switch (subcommand) {
                    case "fiú":
                    case "lány":
                        for (let index = 0; index < users.USERS.length; index++) {
                            if (users.USERS[index].NICKNAME === args.nev.value) {
                                ind = index;
                                email = users.USERS[index].EMAIL;
                                name = users.USERS[index].NICKNAME;
                                break;
                            }
                        }
                        break;
                    case "tanár":
                        for (let index = 0; index < database.TEACHERS.length; index++) {
                            if (database.TEACHERS[index].NAME === args.nev.value) {
                                ind = index;
                                email = database.TEACHERS[index].EMAIL;
                                name = database.TEACHERS[index].NAME;
                                break;
                            }
                        }
                        break;
                }
                break;
            default:
                switch (subcommand) {
                    case "tag":
                        args = {
                            tag: opts.get('tag')
                        }
                        for (let index = 0; index < users.USERS.length; index++) {
                            if (users.USERS[index].USER_ID === args.tag.value) {
                                ind = index;
                                email = users.USERS[index].EMAIL;
                                name = users.USERS[index].NICKNAME;
                                break;
                            }
                        }
                        if (ind === undefined) {
                            interaction.reply({content: "Érvénytelen paraméter!", ephemeral: true});
                            return;
                        }
                        break;
                }
                break;
        }
        row.addComponents([
            new Discord.MessageButton()
                .setLabel("Email küldése")
                .setStyle("LINK")
                .setURL(`https://bencetuzson.github.io/mailtoredirect/index?email=${email}@gyermekekhaza.hu`),
            new Discord.MessageButton()
                .setLabel("Email küldése Gmail-en")
                .setStyle("LINK")
                .setURL(`https://mail.google.com/mail?view=cm&tf=0"?&to=${email}@gyermekekhaza.hu`)
        ]);
        interaction.reply({content: `**${name} email címe:** ${email}@gyermekekhaza.hu`, components: [row]});
    }
}
