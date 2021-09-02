const Discord = require('discord.js');

module.exports = {
    name: 'modify',
    description: 'modifies a message sent by GYH BOT',
    admin : true,
    roles : [],
    guilds : [],
    async execute(message, args, setup, bot){
        const embed = new Discord.MessageEmbed()

        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
        .setDescription(`

`)
        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

        .setColor("RANDOM");
        let messageID;
        let description = "";
        switch (args[1].toLowerCase()) {
            case "intro":
                embed.setTitle("BOT");
                messageID = setup.ROLES.BOT.MESSAGE_ID;
                break;
            case "rules":
                embed.setTitle("Gaming");
                messageID = setup.ROLES.Gaming.MESSAGE_ID;
                break;
            case "bot":
                embed.setTitle("BOT");
                messageID = setup.ROLES.BOT.MESSAGE_ID;
                break;
            case "gaming":
                embed.setTitle("Gaming");
                messageID = setup.ROLES.Gaming.MESSAGE_ID;
                break;
            case "zene":
                embed.setTitle("Zene");
                messageID = setup.ROLES.Zene.MESSAGE_ID;
                break;
            case "teszter":
                embed.setTitle("Teszter");
                messageID = setup.ROLES.Teszter.MESSAGE_ID;
                break;
            case "spam":
                embed.setTitle("Spam");
                messageID = setup.ROLES.Spam.MESSAGE_ID;
                break;
            case "programozas":
                embed.setTitle("Programozás");
                messageID = setup.ROLES.Programozas.MESSAGE_ID;
                break;
            case "verify":
                embed.setTitle(`Elfogadod az itt leírtakat?`);
                messageID = setup.ROLES.Verified.MESSAGE_ID;
                break;
            case "done":
                embed.setTitle("Minden kategóriát kiválasztottál, ami érdekel?");
                messageID = setup.ROLES.Ezek_erdekelnek.MESSAGE_ID;
                break;
            case "test":
                embed.setTitle("Test");
                messageID = setup.ROLES.Gaming.MESSAGE_ID;
                break;
            case "iprogramozas":
                embed.setTitle("Ezek közül melyeket használod?");
                description = "";
                for (const [key, value] of Object.entries(setup.ROLES.Programozas.CHANNELS)) {description += `${value.CUSTOM_EMOTE ? bot.emojis.cache.get(value.EMOTE_ID) : value.EMOTE_ID}: ${value.NAME}\n`;}
                break;
            case "igaming":
                embed.setTitle("Ezek közül melyekkel játszol?");
                for (const [key, value] of Object.entries(setup.ROLES.Gaming.CHANNELS)) {description += `${value.CUSTOM_EMOTE ? bot.emojis.cache.get(value.EMOTE_ID) : value.EMOTE_ID}: ${value.NAME}\n`;}
                embed.setDescription(description)
                messageID = setup.ROLES.Gaming.CHANNELS_MESSAGE_ID;
                break;
            default:
                console.error("Invalid parameter!");
                break;
        }
        await message.channel.messages.fetch(messageID).then(msg => msg.edit({embeds: [Embed]}));

        function getChannel (id) { return message.guild.channels.cache.get(id); }

        function print (path, choosable) {
            return `**${getChannel(path)}**${choosable ? " (választható)" : ""}\n-*${getChannel(path).topic}*`
        }
    }
}
