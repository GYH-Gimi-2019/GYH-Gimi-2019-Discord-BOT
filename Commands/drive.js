const Discord = require('discord.js');

module.exports = {
    name: 'drive',
    description: 'sends the class\'s Google Drive shared drive',
    async execute(interaction, args, setup, bot) {
        let userNum = args ? ` (user ${args[0].value})` : "";
        let user = args ? `/u/${args[0].value}/` : "";
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel("Vezess Oda!")
                    .setStyle("LINK")
                    .setURL(`https://drive.google.com/drive${user}folders/${setup.DRIVE}`)
            );
        interaction.reply({content: `**Az osztály Google Drive megosztott meghajtója${userNum}**`, components: [row]});
    }
}
