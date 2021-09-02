const Discord = require('discord.js');

module.exports = {
    name: 'vendeg',
    description: 'manages the guests',
    admin: false,
    roles: [],
    guilds: [],
    async execute(interaction, bot, args, guestlist) {
        let alreadyIn = false;
        switch (args[0].name) {
            case "hozzáadás":
                guestlist.forEach(e => {
                    if (e.ID === args[0].options[1]) alreadyIn = true;
                })
                if (alreadyIn) {
                    interaction.reply(`${args[0].options[0]} ID-ja (${args[0].options[1]}) már szerepel az adatbázisban`);
                } else {
                    guestlist.push({"name" : args[0].options[0], "ID" : args[0].options[1], "added_by" : interaction.user.id});
                   interaction.reply(`${args[0].options[0]} sikeresen hozzáadva`);
                }
                break;
            case "eltávolítás":
                let i = 0;
                let index;
                guestlist.forEach(e => {
                    if (e.ID === args[0].options[0]) index = i;
                    i++;
                })
                if (index) {


                    guestlist.splice(index, 1);
                    interaction.reply(`${args[0].options[0]} sikeresen eltávolítva`);
                } else {

                }
                break;
            case "csekkkolás":
                let out = "";
                guestlist.forEach(e => {out += `${e.name} (<@${e.ID}>)\n`});
                const Embed = new Discord.MessageEmbed()
                    .setTitle("Vendég adatbázis")
                    .setDescription(out)
                    .setColor('RANDOM');
                interaction.reply(Embed);
                break;
        }
        return guestlist;
    }
}