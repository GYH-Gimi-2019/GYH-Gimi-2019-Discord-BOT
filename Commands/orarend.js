const Discord = require('discord.js');

module.exports = {
    name: 'orarend',
    description: 'shows timetable',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, setup, bot){
        const path = setup.TIMETABLE_FILE_PATH;
        const splitPath = path.split("/");
        const Embed = new Discord.MessageEmbed()
        .setTitle(`${setup.CURRENT_SCHOOLYEAR} ${setup.CURRENT_CLASS} órarend`)
        .setImage(`attachment://${splitPath[splitPath.length - 1]}`)
        .setColor("RANDOM");
        interaction.reply({embeds: [Embed], files: [path]});
    }
}
