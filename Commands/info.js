const Discord = require('discord.js');
const users = require("../../database/users.json");
const database = require("../../database/database.json");
const {birthday} = require("../../beta/Functions/functions");
const {set} = require("mongoose/lib/driver");

module.exports = {
    name: "info",
    description: "returns with the selected user's information",
    /**
     *
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.CommandInteractionOptionResolver} opts
     */
    execute (interaction, opts) {
        const Embed = new Discord.MessageEmbed();
        const subcommandGroup = opts.getSubcommandGroup(false);
        const subcommand = opts.getSubcommand();
        let args;
        let user = {
            name: undefined,
            nickname: undefined,
            email: undefined,
            telephone: undefined,
            om: undefined,
            birthday: undefined,
            address: undefined,
        };
        let temp;
        switch (subcommandGroup) {
            case "név":
                args = {
                    nev: opts.getString("név")
                }
                switch (subcommand) {
                    case "fiú":
                    case "lány":
                        temp = users.USERS.find(u => u.NICKNAME === args.nev);
                        setData();
                        break;
                }
                break;
            case "tanár":
                temp = database.TEACHERS.forEach(t => t.NAME === args.nev);
                setData();
                break;

        }

        function setData() {
            if (temp.FIRSTNAME || temp.LASTNAME)
            if (temp.NICKNAME) user.nickname = temp.NICKNAME;
            if (temp.EMAIL) user.email = temp.EMAIL;
            if (temp.TELEPHONE) user.telephone = temp.TELEPHONE;
            if (temp.OM) user.om = temp.OM;
            if (temp.BIRTHDAY) user.birthday = `${temp.BIRTHDAY.YEAR}. ${monthToString(temp.BIRTHDAY.MONTH)} ${temp.BIRTHDAY.DAY}.`;
            if (temp.ADDRESS) user.address = `${temp.ADDRESS.POSTCODE} ${temp.ADDRESS.CITY}\n${temp.ADDRESS.STREET}`;
        }

        function monthToString(month) {
            switch (month) {
                case 1:
                    return "Január";
                case 2:
                    return "Február";
                case 3:
                    return "Március";
                case 4:
                    return "Április";
                case 5:
                    return "Május";
                case 6:
                    return "Június";
                case 7:
                    return "Július";
                case 8:
                    return "Augusztus";
                case 9:
                    return "Szeptember";
                case 10:
                    return "Október";
                case 11:
                    return "November";
                case 12:
                    return "December";
                default:
                    return month;
            }
        }
    }
}