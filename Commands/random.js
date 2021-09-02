const Discord = require('discord.js');

module.exports = {
    name: 'random',
    description: 'picks a random class member',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, users, bot){
        users = users.USERS;
        let class_members = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].REAL) class_members.push(users[i]);
        }
        const randomElement = class_members[Math.floor(Math.random() * class_members.length)];
        const Embed = new Discord.MessageEmbed()
            .setTitle('A random osztálytárs nem más, mint...')
            .setDescription(randomElement.NICKNAME)
            .setColor(bot.guilds.cache.get(interaction.guildId).roles.cache.get(randomElement.ROLE_ID).color ? bot.guilds.cache.get(interaction.guildId).roles.cache.get(randomElement.ROLE_ID).color : 'RANDOM');
        const row = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton()
                    .setLabel("Új generálása")
                    .setStyle(1)
                    .setCustomId("new_random")
            ])
        interaction.reply({embeds: [Embed], components: [row]});

    }
}
