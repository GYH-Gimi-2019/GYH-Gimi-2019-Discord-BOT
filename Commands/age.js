module.exports = {
    name: 'age',
    description: 'returns age',
    admin : true,
    roles : [],
    guilds : [],
    execute(message, args, users) {
        let ind = null;
        const now = new Date();
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].NICKNAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.USERS[index].NICKNAME.toLowerCase() === args[1].toLowerCase()) {
                ind = index;
                break;
            } else if (users.USERS[index].USER_ID === args[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) {
                ind = index;
                break;
            }
        }

        message.channel.send(`${users.USERS[ind].NICKNAME} kora: ${getAge()}`);

        function getAge() {
            if (now.getMonth() + 1 >= users.USERS[ind].BIRTHDAY.MONTH) {
                if (now.getDate() >= users.USERS[ind].BIRTHDAY.DAY) {
                    return now.getFullYear() - users.USERS[ind].BIRTHDAY.YEAR
                } else {
                    return now.getFullYear() - users.USERS[ind].BIRTHDAY.YEAR - 1;
                }
            } else {
                return now.getFullYear() - users.USERS[ind].BIRTHDAY.YEAR - 1;
            }
        }
    }
}
