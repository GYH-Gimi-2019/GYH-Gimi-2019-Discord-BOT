const Discord = require('discord.js');
const setup = require("../../database/setup.json")

module.exports = {
    name: 'msg',
    description: 'picks',
    /**
     *
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.CommandInteractionOptionResolver} opts
     */
    async execute(interaction, opts) {
        const args = {
            cimzett: opts.getUser('címzett'),
            uzenet: opts.getString('üzenet')
        }
        if (!interaction.guild.members.cache.get(args.cimzett.id).roles.cache.has(setup.ROLES.Patronus.ROLE_ID)) {
            args.cimzett.send(`Üzenet egy titkos feladótól: ${args.uzenet}`).then(() => {
                interaction.reply({content: `Titkos üzenet neki: ${args.cimzett}, üzenet: ${args.uzenet}`, ephemeral: true});
            });
        } else {
            interaction.reply({content: `Sajnálom, de nem küldhetsz titkos üzenetet neki: ${args.cimzett}, mivel patrónus.`, ephemeral: true});
        }
    }
}
