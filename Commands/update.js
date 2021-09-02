const Discord = require('discord.js');
const slash_commands = require("../../database/slash_commands.json");
const setup = require("../../database/setup.json");

module.exports = {
    name: 'update',
    description: 'updates the commands',
    async execute(interaction, args, setup, slash_commands, bot) {
        slash_commands.MAIN.forEach(c => {
            console.log(c.name);
            bot.guilds.cache.get(setup.GUILD_ID).commands.create(c).then((command) => {
                if (c.permissions) {
                    command.permissions.set({permissions: c.permissions});
                }
            });
            console.log(c.name + " kész");
        });
        slash_commands.ADMIN.forEach(c => {
            console.log(c.name);
            c.defaultPermission = false;
            bot.guilds.cache.get(setup.GUILD_ID).commands.create(c).then((command) => {
                if (c.permissions) {
                    command.permissions.set({permissions: c.permissions});
                }
                command.permissions.add({permissions: [{
                        id: setup.ROLES.Moderator.ROLE_ID,
                        type: "ROLE",
                        permission: true
                    }]})
            });

            console.log(c.name + " kész");
        });
    }
}
