const Discord = require('discord.js');

module.exports = {
    name: 'szinek',
    description: 'changes the author\'s personal role\'s colour',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, database) {
        const colours = database.COLOURS;
        const discord_colours = "`DEFAULT`, `WHITE`, `AQUA`, `GREEN`, `BLUE`, `YELLOW`, `PURPLE`, `LUMINOUS_VIVID_PINK`, `GOLD`, `ORANGE`, `RED`, `GREY`, `DARKER_GREY`, `NAVY`, `DARK_AQUA`, `DARK_GREEN`, `DARK_BLUE`, `DARK_PURPLE`, `DARK_VIVID_PINK`, `DARK_GOLD`, `DARK_ORANGE`, `DARK_RED`, `DARK_GREY`, `LIGHT_GREY`, `DARK_NAVY`, `BLURPLE`, `GREYPLE`, `DARK_BUT_NOT_BLACK`, `NOT_QUITE_BLACK`, `RANDOM`";
        let custom_colours = "";
        for (let i = 0; i < colours.length; ++i) {
            custom_colours += `\`${colours[i].NAME}\`${colours.length-1 === i ? "" : ", "}`
        }
        const Embed = new Discord.MessageEmbed()
            .setTitle("Színek")
            .addFields(
                {name: "Discord", value: discord_colours},
                {name: "Egyéni", value: custom_colours}
            )
            .setColor('RANDOM');
        interaction.reply({embeds: [Embed]});
    }
}
