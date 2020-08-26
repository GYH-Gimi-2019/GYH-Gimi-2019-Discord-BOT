const Discord = require('discord.js');
const setup = require('../setup/setup.json');

module.exports = {
    name: 'random',
    description: 'picks a random class member',
    execute(message, args){
        var class_members = setup.CLASS_MEMBERS;
        const randomElement = class_members[Math.floor(Math.random() * class_members.length)];
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
        const Embed = new Discord.MessageEmbed()
        .setTitle('A random osztálytárs nem más, mint...')
        .setDescription(`${randomElement}`)
        .setColor(randomColour);
        message.channel.send(Embed);
    }
}