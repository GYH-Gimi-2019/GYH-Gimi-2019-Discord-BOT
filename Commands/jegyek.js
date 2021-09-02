const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'jegyek',
    description: 'writes out the link for the grades',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction) {
        const Embed = new Discord.MessageEmbed()
            .setTitle("Itt tudod megnézni az értékeléseid")
            .setDescription("**Felhasználónév:** *a telves neved*\n**Alapértelmezett jelszó:** *OM azonosítód*\nNe felejtsd el átálllítani __Tanuló__ra!")
            .setColor('RANDOM');
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel("Vezess Oda!")
                    .setStyle("LINK")
                    .setURL("http://online-ertekeles.hu/gyhgimi")
        );
        interaction.reply({embeds: [Embed], components: [row]})
    }
}
