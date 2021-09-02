console.log("Starting up...");

require('./functions')();
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client({
    partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'],
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"]
});

let setup = require('../database/setup.json');
let users = require('../database/users.json');
let prefix = setup.PREFIX.MAIN;
let database = require('../database/database.json');
let timetable = require('../database/timetable.json');
let commands = require('../database/commands.json');
let slash_commands = require('../database/slash_commands.json');
let message_commands = require('../database/message_commands.json');
let user_commands = require('../database/user_commands.json');
//let googleapi = require(setup.GOOGLEAPI_PATH);
//let googlecredentials = require(setup.GOOGLECREDENTIALS_PATH);
const status = `/${setup.HELP_COMMAND}`;
const childProcess = require('child_process');
const fs = require('fs');
const util = require('util');
const clock = require('date-events')();

/*runScript(setup.TEST_PATH, function (err) {
    if (err) throw err;
    console.log('finished running');
});*/


let split;
let beSent;
let replyTemp;
const readline = require("readline");

let remoteMsg;
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./Commands/").filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(setup.COMMANDS_PATH + file);
    bot.commands.set(command.name, command);
}

let now = new Date();

bot.on('ready', async () => {
    console.log(`${bot.user.tag} bot is now active (${monthToString(now.getMonth() + 1)} ${now.getDate()} ${now.getFullYear()} ${now.getHours() < 10 ? 0 : ""}${now.getHours()}:${now.getMinutes() < 10 ? 0 : ""}${now.getMinutes()}:${now.getSeconds() < 10 ? 0 : ""}${now.getSeconds()})`);
    bot.user.setPresence({status: "online", activities: [{name: setup.DB_STATUS ? setup.STATUS : status, type: setup.ACTIVITY}]});
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("Restarted...");
    //console.log(await bot.guilds.cache.get(setup.GUILD_ID).commands);
    //await bot.api.applications(bot.user.id).commands("878677249958772746").delete();
    /*slash_commands.MAIN.forEach(c => {
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
     */
    let commands = [];
    slash_commands.MAIN.forEach(c => {
        c.type = "CHAT_INPUT";
        commands.push(c);
    });
    slash_commands.ADMIN.forEach(c => {
        c.type = "CHAT_INPUT";
        c.defaultPermission = false;
        if (!c.permissions) c.permissions = [];
        c.permissions.push({
            id: setup.ROLES.Moderator.ROLE_ID,
            type: "ROLE",
            permission: true
        })
        commands.push(c);
    });
    slash_commands.TEST.forEach(c => {
        c.type = "CHAT_INPUT";
        c.defaultPermission = false;
        if (!c.permissions) c.permissions = [];
        c.permissions.push({
            id: setup.ROLES.Teszter.ROLE_ID,
            type: "ROLE",
            permission: true
        })  
        commands.push(c);
    });
    message_commands.forEach(c => {
        c.type = "MESSAGE";
        commands.push(c);
    });
    user_commands.forEach(c => {
        c.type = "USER";
        commands.push(c);
    });
    await bot.guilds.cache.get(setup.GUILD_ID).commands.set(commands);
    /*
   //for (const [key, value] of Object.entries(setup.ROLES.Programozas.CHANNELS)) {
       // console.log(value.ROLE_ID)
    let chs = [];
    let rs = [];
    for (let i = 0; i < chs.length; i++) {
        bot.channels.cache.get(chs[i]).permissionOwerwrites.edit(rs[i], [
            Discord.Permissions.FLAGS.SEND_MESSAGES,
            Discord.Permissions.FLAGS.USE_PUBLIC_THREADS,
            Discord.Permissions.FLAGS.USE_PRIVATE_THREADS,
            Discord.Permissions.FLAGS.EMBED_LINKS,
            Discord.Permissions.FLAGS.ATTACH_FILES,
            Discord.Permissions.FLAGS.ADD_REACTIONS,
            Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
            Discord.Permissions.FLAGS.USE_EXTERNAL_STICKERS,
            Discord.Permissions.FLAGS.MENTION_EVERYONE,
            Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY,
            Discord.Permissions.FLAGS.SEND_TTS_MESSAGES,
            Discord.Permissions.FLAGS.USE_APPLICATION_COMMANDS,
            Discord.Permissions.FLAGS.CONNECT,
            Discord.Permissions.FLAGS.SPEAK,
            Discord.Permissions.FLAGS.STREAM,
            Discord.Permissions.FLAGS.USE_VAD,
            Discord.Permissions.FLAGS.REQUEST_TO_SPEAK
        ])
    }*/
});
bot.on('error', (error) => {
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send(error);
});

function channelLog(err) {bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("```\n" + err + "\n```");}

function databaseUpdate(message) {
    setSetup();
    setUsers();
    setDatabase();
    setTimetable();
    if (message) message.channel.send("Az adatbázisok sikeresen frissítve!");
}

function setSetup() {
    delete require.cache[require.resolve('../database/setup.json')];
    setup = require('../database/setup.json');
}

function setUsers() {
    delete require.cache[require.resolve(setup.USERS_PATH)];
    users = require(setup.USERS_PATH);
}

function setDatabase() {
    delete require.cache[require.resolve(setup.DATABASE_PATH)];
    database = require(setup.DATABASE_PATH);
}

function setTimetable() {
    delete require.cache[require.resolve(setup.TIMETABLE_PATH)];
    database = require(setup.TIMETABLE_PATH);
}

function whichToSet(variable, message) {
    switch (variable) {
        case "setup":
            setSetup();
            if (message) successfulSet(message);
            break;
        case "users":
            setUsers();
            if (message) successfulSet(message);
            break;
        case "database":
            setDatabase();
            if (message) successfulSet(message);
            break;
        case "timetable":
            setTimetable();
            if (message) successfulSet(message);
            break;
        default:
            if (message) message.channel.send("Érvénytelen paraméter!");
            break;
    }
}

function successfulSet(message) {
    message.channel.send("Az adatbázis sikeresen frissítve!")
}

function msgLC(args) {
    return args.content.toLowerCase();
}

function noPrefix(message, args) {
    return message.content.toLowerCase().includes(args);
}

function userSearch(user) {
    return users.USERS.find(u => u.USER_ID === user.id);
}

function genderSearch(user) {
    user = userSearch(user);
    if (user) {
        if (user.GENDER === "M") {
            return new Promise((resolve, reject) => {
                resolve(users.GENDERS_ROLE_ID.BOY)
            });
        } else if (user.GENDER === "F") {
            return new Promise((resolve, reject) => {
                resolve(users.GENDERS_ROLE_ID.GIRL)
            });
        } else {
            console.error("Invalid gender code!");
            return new Promise((resolve, reject) => {
                resolve(undefined)
            });
        }
    }
}

function nicknameSearch(user) {
    if (user) {
        const searchedUser = userSearch(user);
        if (searchedUser) {
            return searchedUser.NICKNAME;
        }
    } else {
        return user.displayName;
    }
}

function teamSearch(user) {
    user = userSearch(user);
    if (user) return database.TEAMS[user.SUBJECTS.TEAM].ID;
}

function moderatorSearch(user) {
    user = userSearch(user);
    if (user) return user.MODERATOR;
}

function gameTesterSearch(user) {
    user = userSearch(user);
    if (user) return user.GAME_TESTER;
}

function botDevSearch(user) {
    user = userSearch(user);
    if (user) return user.GitHub_Team;
}

function languageSearch(user) {
    user = userSearch(user);
    if (user) return user.SUBJECTS.LANGUAGE;
}

function groupSearch(user) {
    user = userSearch(user);
    if (user) return user.SUBJECTS.GROUPS;
}

function personalRole(user) {
    user = userSearch(user);
    if (user) return user.ROLE_ID;
}

function isReal(user) {
    user = userSearch(user);
    if (user) return user.REAL;
}

function birthdate(year, month, day) {
    let birthdays = [];
    users.USERS.forEach(u => {
        if (u.BIRTHDAY.MONTH === month && u.BIRTHDAY.DAY === day) {
            birthdays.push(users.USERS[index].USER_ID)
        }
    });
    return birthdays;
}

function age(year, month, day) {
    const ages = [];
    users.USERS.forEach(u => {
        if (u.BIRTHDAY.MONTH === month && u.BIRTHDAY.DAY === day) {
            ages.push(year - u.BIRTHDAY.YEAR);
        }
    });
    return ages;
}

function birthday(year, month, day) {
    const birthdates = birthdate(year, month, day);
    const ages = age(year, month, day);
    for (let indexBD = 0; indexBD < birthdates.length; indexBD++) {
        let DMuser = bot.users.cache.get(birthdates[indexBD]);
        if (DMuser) DMuser.send(setup.BIRTHDAY_MESSAGE.replace(setup.USER_NAME, `${nicknameById(birthdates[indexBD])}`).replace(setup.AGE, `${ages[indexBD]}`));
    }
}

function isInThisClass(member) {
    member = users.USERS.find(u => u.USER_ID === member.user.id);
    if (member) return member.USER_ID;
    return false;
}

function isGuest(member) {
    member = users.GUESTS.find(u => u.ID === member.user.id);
    if (member) return member.ID;
    return false;
}

function isPatron(member) {
    member = users.PATRONS.find(u => u.ID === member.user.id);
    if (member) return member.ID;
    return false;
}

function runScript(scriptPath, callback) {

    var invoked = false;
    var process = childProcess.fork(scriptPath);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function monthToString(month) {
    switch (month) {
        case 1:
            return "Jan";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sep";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
        default:
            break;
    }
}

function idByNickname(name) {
    for (const raw of users.USERS) {
        if (name === raw.NICKNAME) {
            return raw.USER_ID;
        }
    }
}

function nicknameById(id) {
    
    for (const raw of users.USERS) {
        if (id === raw.USER_ID) {
            return raw.NICKNAME;
        }
    }
}

function inappropriateGuild(guild) {
    if (guild !== null && guild.id !== setup.GUILD_ID && guild.id !== setup.EMOTE_GUILD_ID) {
            guild.leave();
            console.log(`Guild ${guild} left`);
    }
}

async function findMessage(message, ID) {
    return message.channel.messages.fetch(ID);
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function classLength() {
    let names = [];
    for (let ind = 0; ind < users.USERS.length; ++ind) {
        if(users.USERS[ind].REAL){names.push(users.USERS[ind]);}
    }
    return names.length;
}

function normalise (str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isOnBlacklist(user_id) {return setup.BLACKLIST.includes(nicknameById(user_id));}

function removeReaction(channel_id, message_id, reaction, user) {bot.channels.cache.get(channel_id).messages.fetch(message_id).then(msg => msg.reactions.cache.get(reaction).users.remove(user.id))}
function fetchReactions(channel_id, message_id, reaction, user) {const r = bot.channels.cache.get(channel_id).messages.cache.get(message_id); if(r) return r.reactions.cache.get(reaction).users.cache.get(user.id);}
function reVerifyRoleAdd(channel_id, message_id, reaction, user, role, local_reaction){bot.channels.cache.get(channel_id).messages.fetch(message_id).then(message => message.reactions.cache.get(reaction).users.fetch(user.id).then(usr => {if (usr.get(user.id)) local_reaction.message.guild.members.cache.get(user.id).roles.add(role);}))}

bot.on('interactionCreate', async (interaction) => {
    console.log(`i+ g: ${interaction.guild_id} c: ${interaction.channel_id} u: ${interaction.member.id}/${interaction.member.nick}`);
    console.log(util.inspect(interaction, false, null, true));
    //console.log(interaction.id);

    let command;
    let opts;

    switch (interaction.type) {
        case "PING":
            console.log("Pinged");
            return;
        case "MESSAGE_COMPONENT":
            switch (interaction.componentType) {
                case "BUTTON":
                    switch (interaction.customId) {
                        case "new_dq":
                            bot.commands.get('dq').execute(await interaction, database, users, bot);
                            break;
                        case "new_random":
                            bot.commands.get('random').execute(interaction, opts, users, bot);
                            break;
                        case "csapat":
                        case "parok":
                        case "sorrend":
                            //findOptions();
                            opts = interaction.message.channel.messages.find(m => m.interaction.id === interaction.message.interaction.id).interaction.options;
                            bot.commands.get('csapat-parok-sorrend').execute(await interaction, opts, database, users, bot, interaction.customId);
                            break;
                        case "set_colour":
                            //console.log(interaction);
                            //bot.commands.get('szin').execute(await interaction, getOpts(), users, database, bot);
                            break;
                        case "terms_accept":
                            if (!interaction.member.roles.cache.has(setup.ROLES.Verified.ROLE_ID)) {
                                interaction.member.roles.add(setup.ROLES.Ezek_erdekelnek.ROLE_ID);
                                interaction.member.roles.remove(setup.ROLES.Unverified.ROLE_ID);
                            }
                            interaction.deferUpdate();
                            break
                        case "terms_deny":
                            interaction.member.send(setup.TERMS_DENIED_DM.replace(setup.USER_NAME, nicknameSearch(interaction.member)).replace(setup.SERVER_NAME, interaction.guild.name)).then(() => interaction.member.kick(setup.TERMS_DENIED_KICK_REASON));
                            break;
                        case "verify":
							if (!interaction.member.roles.cache.has(setup.ROLES.Verified.ROLE_ID)) {
								interaction.guild.roles.fetch(setup.ROLES.Ezek_erdekelnek.ROLE_ID).then(r => interaction.member.roles.add(r));
								interaction.guild.roles.fetch(setup.ROLES.Unverified.ROLE_ID).then(r => interaction.member.roles.remove(r));
							}
                            interaction.deferUpdate();
                            break;
                        case "no_role":
                            verify();
                            break;
                    }
                    function findOptions() {
                        do {
                            opts = interaction.message.interaction;
                            if (opts.hasOwnProperty("options")) {
                                opts = opts.options;
                            } else {
                                opts = opts.message.interaction;
                            }
                        } while (!opts.hasOwnProperty("options"));
                    }
                    function getOpts () {
                        return interaction.message.interaction.options;
                    }
                    return;
                case "SELECT_MENU":
                    opts = interaction.values;
                    switch (interaction.customId) {
                        case "help":
                            bot.commands.get('parancsok').execute(interaction, opts, users, commands, prefix, bot, database, slash_commands, setup);
                            break;
                        case "programozas":
                        case "gaming":
                        case "interests":
                            let optRoles = [];
                            switch (interaction.customId) {
                                case "programozas":
                                    for (const [key, value] of Object.entries(setup.ROLES.Programozas.CHANNELS)) { optRoles.push(setup.ROLES.Programozas.CHANNELS[key].ROLE_ID); }
                                    break;
                                case "gaming":
                                    for (const [key, value] of Object.entries(setup.ROLES.Gaming.CHANNELS)) { optRoles.push(setup.ROLES.Gaming.CHANNELS[key].ROLE_ID); }
                                    break;
                                case "interests":
                                    for (const [key, value] of Object.entries(setup.ROLES)) { if (setup.ROLES[key].hasOwnProperty("OPTIONAL") && setup.ROLES[key].OPTIONAL) optRoles.push(setup.ROLES[key].ROLE_ID); }
                                    break;
                            }
                            optRoles.forEach(r => {
                                if (interaction.member.roles.cache.has(r)) {
                                    if (!opts.includes(r)) {
                                        interaction.member.roles.remove(r);
                                    }
                                } else {
                                    if (opts.includes(r)) {
                                        interaction.member.roles.add(r);
                                    }
                                }
                            });
                            verify();
                            break;
                    }
                    return;
            }
            return;
        case "APPLICATION_COMMAND":
            console.log(typeof interaction);
            command = interaction.commandName.toLowerCase();
            opts = interaction.options;

            console.log(command);
            if (!isOnBlacklist(interaction.member.id))
                switch (command) {
                    case setup.HELP_COMMAND:
                        bot.commands.get('parancsok').execute(interaction, opts, users, commands, prefix, bot, database, slash_commands, setup);
                        break;
                    case "random":
                        bot.commands.get('random').execute(interaction, opts, users, bot);
                        break;
                    case "csapat": case "parok": case "sorrend":
                        bot.commands.get('csapat-parok-sorrend').execute(await interaction, opts, database, users, bot, command);
                        break;
                    case "orarend":
                        bot.commands.get('orarend').execute(await interaction, opts, setup, bot);
                        break;
                    case "szulinap":
                        bot.commands.get('szulinap').execute(await interaction, users, bot, opts);
                        break;
                    case "orak":
                        bot.commands.get('orak').execute(await interaction, opts, users, timetable, bot);
                        break;
                    case "jon": case "most":
                        bot.commands.get('jon-most').execute(await interaction, opts, users, timetable, bot, command);
                        break;
                    case "szin":
                        bot.commands.get('szin').execute(await interaction, opts, users, database, bot);
                        break;
                    case "szinek":
                        bot.commands.get('szinek').execute(await interaction, opts, database, bot);
                        break;
                    case "dq":
                        bot.commands.get('dq').execute(await interaction, database, users, bot);
                        break;
                    case "nev":
                        bot.commands.get('nev').execute(interaction, opts, users, bot);
                        break;
                    case "laptop":
                        bot.commands.get('laptop').execute(await interaction, opts, users, timetable, bot);
                        break;
                    case "email":
                        bot.commands.get('email').execute(await interaction, opts, users, database, bot);
                        break;
                    case "classroom": case "meet":
                        bot.commands.get('classroom-meet').execute(await interaction, opts, users, timetable, bot, command);
                        break;
                    case "meeten":
                        bot.commands.get('meeten').execute(interaction, opts, users, database, bot);
                        break;
                    case "gif":
                        bot.commands.get('gif').execute(await interaction, opts, bot);
                        break;
                    case "jegyek":
                        bot.commands.get('jegyek').execute(await interaction, opts, bot);
                        break;
                    case "szobak":
                        bot.commands.get('szobak').execute(await interaction, opts, setup, /*googleapi, googlecredentials,*/ bot);
                        break;
                    case "update":
                        bot.commands.get('update').execute(await interaction, opts, setup, slash_commands, bot);
                        break;
                    case "drive":
                        bot.commands.get('drive').execute(await interaction, opts, setup, bot);
                        break;
                    case "msg":
                        bot.commands.get('msg').execute(await interaction, opts);
                        break;
                    case "run":
                        if (idByNickname("Tuzsi") === interaction.user.id) {
                            interaction.reply({content: "Running...", ephemeral: true});
                            try {
                                eval(opts.getString('script'));
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        break;
                    case "ocr":
                        bot.commands.get('ocr').execute(await interaction, opts);
                        break;
                    case "member data":
                    case "user data":
                        bot.commands.get('data').execute(await interaction, command, bot);
                        break;

                    /*default:
                        bot.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: {
                            content: "```json\n" + JSON.stringify(interaction, null, 2) + "\n```"
                        }}});
                        break;*/
                }
            return;
    }
    function verify() {
        if (interaction.member.roles.cache.has(setup.ROLES.Ezek_erdekelnek.ROLE_ID)) {
            interaction.member.send(setup.WELCOME_MESSAGE.replace(setup.USER_NAME, nicknameSearch(interaction.member)).replace(setup.SERVER_NAME, interaction.guild.name));
            interaction.member.setNickname(nicknameSearch(interaction.member));
            interaction.member.roles.add(setup.ROLES.Verified.ROLE_ID);
            genderSearch(interaction.member).then(result => {
                if (result) interaction.member.roles.add(result);
            })
            interaction.member.roles.add(setup.ROLES.Tag.ROLE_ID);
            interaction.member.roles.remove(setup.ROLES.Ezek_erdekelnek.ROLE_ID);
            interaction.member.roles.add(personalRole(interaction.member));
            if (moderatorSearch(interaction.member)) interaction.member.roles.add(setup.ROLES.Moderator.ROLE_ID);
            if (gameTesterSearch(interaction.member)) interaction.member.roles.add(setup.ROLES.Game_Tester.ROLE_ID);
            if (botDevSearch(interaction.member)) interaction.member.roles.add(setup.ROLES.GitHub_Team.ROLE_ID);
            if (teamSearch(interaction.member)) interaction.member.roles.add(teamSearch(interaction.member));
            switch (languageSearch(interaction.member)) {
                case "G":
                    interaction.member.roles.add(setup.ROLES.Nemet.ROLE_ID);
                    break;
                case "F":
                    interaction.member.roles.add(setup.ROLES.Francia.ROLE_ID);
                    break;
            }
            switch (groupSearch(interaction.member)) {
                case 1:
                    interaction.member.roles.add(setup.ROLES.G1.ROLE_ID);
                    break;
                case 2:
                    interaction.member.roles.add(setup.ROLES.G2.ROLE_ID);
                    break;
            }
        } else {
            if (interaction.isButton()) {
                for (const [key, value] of Object.entries(setup.ROLES)) { if (setup.ROLES[key].hasOwnProperty("OPTIONAL") && setup.ROLES[key].OPTIONAL) { if (interaction.member.roles.cache.has(setup.ROLES[key].ROLE_ID)) interaction.member.roles.remove(setup.ROLES[key].ROLE_ID); } }
                //for (const [key, value] of Object.entries(setup.ROLES.Gaming.CHANNELS)) { if (interaction.member.roles.cache.has(setup.ROLES.Gaming.CHANNELS[key].ROLE_ID)) interaction.member.roles.remove(setup.ROLES.Gaming.CHANNELS[key].ROLE_ID); }
                //for (const [key, value] of Object.entries(setup.ROLES.Programozas.CHANNELS)) { if (interaction.member.roles.cache.has(setup.ROLES.Programozas.CHANNELS[key].ROLE_ID)) interaction.member.roles.remove(setup.ROLES.Programozas.CHANNELS[key].ROLE_ID); }
            }
        }
        interaction.deferUpdate();
    }
});

bot.on('messageCreate', async (message) => {
    inappropriateGuild(message.guild);
    //console.log(`m+ g: ${message.guild.id} c: ${message.channel.id} m: ${message.id} u: ${message.author.id}`);

    function hasAdmin() {return message.member.permissions.has("ADMINISTRATOR");}
    function isDM() {return message.guild === null;}

    beSent = "";
    replyTemp = [];
    remoteMsg = message;
    if (message.author.bot) return;
    let args = message.content.split(' ');
    let requiredPrefix = isDM() ? "" : prefix;

    if (!isOnBlacklist(message.author.id))
    switch (args[0].toLowerCase()) {
        case `${requiredPrefix}rainbow`:
            if (message.author.id === idByNickname("Tuzsi") && !isDM())
            bot.commands.get('rainbow').execute(await message, args, users);
            break;
        case `${requiredPrefix}ping`:
            bot.commands.get('ping').execute(await message, args, bot);
            break;
        case `${requiredPrefix}rang`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('rang').execute(await message, args, setup);
            }
            break;
        case `${requiredPrefix}series`:
            bot.commands.get('series').execute(await message, args, bot);
            break;
        case `${requiredPrefix}verify`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('verify').execute(await message, args, setup, bot);
                setSetup();
            }
            break;
        case `${requiredPrefix}teams`:
            if (!isDM() && hasAdmin()) {
                updateTeams();
            }
            break;
        case `${requiredPrefix}becenev`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('becenev').execute(await message, args, users, setup);
            }
            break;
        case `${requiredPrefix}age`:
            if (!isDM() && hasAdmin() && idByNickname("Tuzsi")) {
                bot.commands.get('age').execute(await message, args, users);
            }
            break;
        case `${requiredPrefix}modify`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('modify').execute(await message, args, setup, bot);
            }
            break;
        case `${requiredPrefix}leave`:
            if (!isDM() && message.author.id === idByNickname("Tuzsi")) {
                await message.guild.leave();
            }
            break;
        case `${requiredPrefix}kick`:
            if (!isDM() && message.author.id === idByNickname("Tuzsi")) {
                await message.guild.kick();
            }
            break;
        case `${requiredPrefix}message`:
            if (hasAdmin()) findMessage(message, args[1]).then(msg => args.length === 2 ? message.channel.send("```json\n" + JSON.stringify(msg, null, 2) + "\n```") : message.channel.send("Érvénytelen paraméter!"));
            break;
        case `${requiredPrefix}database`:
            if (hasAdmin()) {
                switch (args.length) {
                    case 1:
                        databaseUpdate(message)
                        break;
                    case 2:
                        whichToSet(args[1], message);
                        break;
                    default:
                        message.channel.send("Érvénytelen paraméter!");
                        break;
                }
            }
            break;
        /*case `${requiredPrefix}bejonni`:
            bot.commands.get('bejonni').execute(await message, args, users, timetable);
            break;*/
        case `${requiredPrefix}test`:
            if (!isDM() && hasAdmin()) {
                message.pin();
                message.unpin();
            }
            break;
    }

    if (message.author !== bot.user/* && message.author.id !== idByNickname("Tuzsi")*//* && message.member.user.id != users.USERS.Tuzsi.USER_ID*/) {
        let msg;
        let splitWord_exc;
        let splitMessage = message.content.replace(/[!-?{-¿\[-`÷ʹ-͢]/g, "").split(" ");
        let ind;
        let ind2;
        database.INAPPROPRIATE.forEach(function (word) {
            if (noPrefix(message, word)) {
                split = message.toString().toLowerCase().split(" ");
                split.forEach(function (msg) {
                    if (msg.includes(word) && !replyTemp.includes(msg)) {
                        database.INAPPROPRIATE_EXCEPTION.forEach(function (word_exc) {
                            if (word_exc.includes(word)) {
                                splitWord_exc = word_exc.split(" ");
                                ind = splitWord_exc.indexOf(word);
                                ind2 = splitMessage.indexOf(word);
                                if (splitMessage.slice(ind2 - ind, ind2 - ind + splitWord_exc.length).join(" ") === word_exc) {
                                    splitMessage.splice(ind2 - ind, splitWord_exc.length);
                                }
                            }
                        })
                    }
                });
                splitMessage.forEach(function (msg) {
                    if (msg.includes(word) && !replyTemp.includes(msg)) {
                        replyTemp.push(msg);
                    }
                });
            }
        });
        replyTemp.forEach(msg => beSent += (beSent === "" ? "" : " ") + msg);
        if (beSent) {
            message.reply(`Te vagy ${beSent.replace(/[!-?{-¿\[-`÷ʹ-͢]/g, "")}!`);
        }
        database.GREETINGS.forEach(function (word) {
            if (msgLC(message) === word || msgLC(message) === word + "!" || msgLC(message) === word + ".") {
                message.reply(`Szia, ${nicknameSearch(message.author)}!`);
            }
        });
        database.RESPOND.IS.forEach(function (word) {
            msg = message;
            if (!word.SAME) {
                msg.content = normalise(msg.content);
                word.FROM = normalise(word.FROM);
            }
            if (msgLC(msg) === word.FROM) {
                message.reply(word.TO, {tts: word.TTS});
            }
        });
        database.RESPOND.HAS.forEach(function (word) {
            msg = message;
            if (!word.SAME) {
                msg.content = normalise(msg.content);
                word.FROM = normalise(word.FROM);
            }
            if (msgLC(msg).includes(word.FROM)) {
                message.reply(word.TO, {tts: word.TTS});
            }
        });
        if (msgLC(message) === "szia matyi") {
            bot.users.cache.get(idByNickname("Matyi")).send("szia matyi");
        } else if (setup.MENTION_CHANNELS.includes(message.channel.id)) {
            users.USERS.forEach( user => {
                user.CALLED.forEach(name => {
                    if (normalise(msgLC(message)).includes(normalise(name.toLowerCase()))) {
                        bot.users.cache.get(user.USER_ID).send(`${message.author} megemlített egy üzenetben`)
                    }
                })
            });
        }
    }

    if (message.channel.id === setup.REACTION_CHANNELS.Spam.one_word_story_in_english && args.length > 1) {
        await message.channel.messages.fetch({limit: 1}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    } else if (message.channel.id === setup.REACTION_CHANNELS.Spam.null_width_space && message.content !== "\u200b") {
        await message.channel.messages.fetch({limit: 1}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }

    function updateTeams() {
        database.TEAMS.forEach(team => {
            message.guild.roles.cache.find(r => r.id === team.ID).edit({name: team.NAME});
            bot.channels.cache.get(team.TEXT_ID).setName(team.NAME);
            bot.channels.cache.get(team.VOICE_ID).setName(team.NAME);
        });
        message.guild.members.cache.forEach(member => {
            let role = teamSearch(member);
            database.TEAMS.forEach(team => {
                if (member.roles.cache.has(team.ID) && !member.roles.cache.has(role)) member.roles.remove(team.ID);
            })
            if (role && member.roles.cache.has(setup.ROLES.Verified.ROLE_ID)) member.roles.add(role);
        })
    }

    function addRoleByID(id) {message.guild.members.cache.get(message.author.id).roles.add(id);}
});

bot.on('messageReactionAdd', async (reaction, user) => {
    console.log(`r+ g: ${reaction.message.guild.id} c: ${reaction.message.channel.id} m: ${reaction.message.id} u: ${user.id} ${reaction.emoji.name}`);

    inappropriateGuild(reaction.message.guild);
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    /*switch (reaction.emoji.name) {
        case setup.ROLES.Gaming.CHANNELS.sim_racing.EMOTE_ID:
            console.log("test");
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                console.log("test2");
                interestRoleAdd("Gaming", "sim_racing");
            }
            break;

        case setup.ROLES.BOT.REACTION :
            if (reaction.message.id === setup.ROLES.BOT.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("BOT");
                }
            }
            break;

        case setup.ROLES.Zene.REACTION :
            if (reaction.message.id === setup.ROLES.Zene.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Zene");
                }
            }
            break;

        case setup.ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.ROLES.Gaming.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Gaming");
                }
            }
            break;

        case setup.ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.ROLES.Teszter.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Teszter");
                }
            }
            break;

        case setup.ROLES.Spam.REACTION :
            if (reaction.message.id === setup.ROLES.Spam.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Spam");
                }
            }
            break;

        case setup.ROLES.Programozas.REACTION :
            if (reaction.message.id === setup.ROLES.Programozas.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Programozas");
                }
            }
            break;

        case setup.ROLES.Verified.REACTION :
            if (reaction.message.id === setup.ROLES.Verified.MESSAGE_ID) {
                if (reaction.emoji.name === setup.ROLES.Verified.REACTION) {
                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.ROLES.Unverified.ROLE_ID)) {
                        if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.ROLES.Tag.ROLE_ID)) {
                            roleAdd("Verified");
                            reVerifyReactionRoleAdd("Gaming");
                            reVerifyReactionRoleAdd("Zene");
                            reVerifyReactionRoleAdd("Spam");
                            reVerifyReactionRoleAdd("Programozas");
                            reVerifyReactionRoleAdd("Teszter");
                            reVerifyReactionRoleAdd("BOT");
                            genderSearch(user).then(result => {
                                if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                            })
                            await reaction.message.guild.members.cache.get(user.id).roles.add(personalRole(user));
                            if (moderatorSearch(user)) roleAdd("Moderator");
                            if (gameTesterSearch(user)) roleAdd("Game_Tester");
                            if (botDevSearch(user)) roleAdd("GitHub_Team");
                            if (teamSearch(user)) addRoleByID(teamSearch(user));
                            switch (languageSearch(user)) {
                                case "G":
                                    roleAdd("Nemet");
                                    break;
                                case "F":
                                    roleAdd("Francia");
                                    break;
                            }
                            switch (groupSearch(user)) {
                                case 1:
                                    roleAdd("G1");
                                    break;
                                case 2:
                                    roleAdd("G2");
                                    break;
                            }
                        } else {
                            roleAdd("Ezek_erdekelnek");
                        }
                    }
                    removeRole("Unverified");
                }
            }
            break;

        case setup.ROLES.Ezek_erdekelnek.REACTION :
            if (reaction.message.id === setup.ROLES.Ezek_erdekelnek.MESSAGE_ID) {
                if (reaction.emoji.name === setup.ROLES.Ezek_erdekelnek.REACTION) {
                    roleAdd("Verified");
                    roleAdd("Tag");
                    if (teamSearch(user)) addRoleByID(teamSearch(user));
                    removeRole("Ezek_erdekelnek");
                    if (genderSearch(user)) {
                        genderSearch(user).then(result => {
                            if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                        });

                    }

                    await reaction.message.guild.members.cache.get(user.id).setNickname(nicknameSearch(reaction, user));

                    try {
                        await reaction.users.remove(user.id);
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    }

                    if (fetchReactionRolesReactions("BOT")) {
                        roleAdd("BOT");
                    }
                    if (fetchReactionRolesReactions("Gaming")) {
                        roleAdd("Gaming");
                    }
                    if (fetchReactionRolesReactions("Zene")) {
                        roleAdd("Zene");
                    }
                    if (fetchReactionRolesReactions("Spam")) {
                        roleAdd("Spam");
                    }
                    if (fetchReactionRolesReactions("Programozas")) {
                        roleAdd("Programozas");
                    }
                    if (fetchReactionRolesReactions("Teszter")) {
                        roleAdd("Teszter");
                    }

                    if (reaction.message.guild.members.cache.get(user.id).roles && personalRole(user)) await reaction.message.guild.members.cache.get(user.id).roles.add(personalRole(user));
                    if (moderatorSearch(user)) roleAdd("Moderator");
                    if (gameTesterSearch(user)) roleAdd("Game_Tester");
                    if (botDevSearch(user)) roleAdd("GitHub_Team");
                    switch (languageSearch(user)) {
                        case "G":
                            roleAdd("Nemet");
                            break;
                        case "F":
                            roleAdd("Francia");
                            break;
                    }
                    switch (groupSearch(user)) {
                        case 1:
                            roleAdd("G1");
                            break;
                        case 2:
                            roleAdd("G2");
                            break;
                    }
                }
            }
            break;

        default:
            break;
    }
    switch (reaction.emoji.id) {
        case setup.ROLES.Gaming.CHANNELS.minecraft.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "minecraft");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.paladins.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "paladins");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.rocket_league.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "rocket_league");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.pubg.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "pubg");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.csgo.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "csgo");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.r6s.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "r6s");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.among_us.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "among_us");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.fortnite.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "fortnite");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.ark.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "ark");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.fall_guys.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "fall_guys");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.gta.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "gta");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.league_of_legends.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "league_of_legends");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.lego.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "lego");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.valorant.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "valorant");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.phasmophobia.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "phasmophobia");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.windows.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "windows");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.mac.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "mac");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.linux.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "linux");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.git.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "git");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.c_cpp.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "c_cpp");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.java.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "java");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.python.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "python");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.c_sharp.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "c_sharp");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.web.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "web");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.javascript.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "javascript");
            }
            break;
    }*/

    function reVerifyReactionRoleAdd(object) {
        reVerifyRoleAdd(setup.ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.ROLES[object].MESSAGE_ID, setup.ROLES[object].REACTION, user, setup.ROLES[object].ROLE_ID, reaction)
    }
    function fetchReactionRolesReactions(object) {return fetchReactions(setup.ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.ROLES[object].MESSAGE_ID, setup.ROLES[object].REACTION, user);}
    async function roleAdd(object) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.ROLES[object].ROLE_ID);}
    async function interestRoleAdd(object, interest) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.ROLES[object].CHANNELS[interest].ROLE_ID);}
    async function removeRole(object) {await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.ROLES[object].ROLE_ID);}
    function hasRole(object) {return reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.ROLES[object].ROLE_ID);}
    function addRoleByID(id) {reaction.message.guild.members.cache.get(user.id).roles.add(id);}

});
bot.on('messageReactionRemove', async (reaction, user) => {
    console.log(`r- g: ${reaction.message.guild.id} c: ${reaction.message.channel.id} m: ${reaction.message.id} u: ${user.id} ${reaction.emoji.name}`);
    inappropriateGuild(reaction.message.guild);
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (!userFound()) return;

    /*switch (reaction.emoji.name) {
        case setup.ROLES.Verified.REACTION :
            if (reaction.message.id === setup.ROLES.Verified.MESSAGE_ID) {
                if (reaction.emoji.name === setup.ROLES.Verified.REACTION) {
                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.ROLES.Tag.ROLE_ID)) {
                        roleAdd("Unverified");
                        removeRole("BOT");
                        removeRole("Zene");
                        removeRole("Gaming");
                        removeRole("Teszter");
                        removeRole("Spam");
                        removeRole("Programozas");
                        removeRole("Verified");
                        removeRole("Moderator");
                        removeRole("Game_Tester");
                        removeRole("GitHub_Team");
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(personalRole(user));
                        if (teamSearch(user)) removeRoleByID(teamSearch(user));
                        genderSearch(user).then(result => {
                            if (result) reaction.message.guild.members.cache.get(user.id).roles.remove(result);
                        })
                        switch (languageSearch(user)) {
                            case "G":
                                removeRole("Nemet");
                                break;
                            case "F":
                                removeRole("Francia");
                                break;
                        }
                        switch (groupSearch(user)) {
                            case 1:
                                removeRole("G1");
                                break;
                            case 2:
                                removeRole("G2");
                                break;
                        }

                    }
                }
            }
            break;

        case setup.ROLES.BOT.REACTION :
            if (reaction.message.id === setup.ROLES.BOT.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("BOT");
                }
            }
            break;

        case setup.ROLES.Zene.REACTION :
            if (reaction.message.id === setup.ROLES.Zene.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Zene");
                }
            }
            break;

        case setup.ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.ROLES.Gaming.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Gaming");
                    interestReactionRoleReset("Gaming", "minecraft");
                    interestReactionRoleReset("Gaming", "paladins");
                    interestReactionRoleReset("Gaming", "rocket_league");
                    interestReactionRoleReset("Gaming", "pubg");
                    interestReactionRoleReset("Gaming", "csgo");
                    interestReactionRoleReset("Gaming", "r6s");
                    interestReactionRoleReset("Gaming", "among_us");
                    interestReactionRoleReset("Gaming", "fortnite");
                    interestReactionRoleReset("Gaming", "ark");
                    interestReactionRoleReset("Gaming", "fall_guys");
                    interestReactionRoleReset("Gaming", "gta");
                    interestReactionRoleReset("Gaming", "league_of_legends");
                    interestReactionRoleReset("Gaming", "lego");
                    interestReactionRoleReset("Gaming", "sim_racing");
                    interestReactionRoleReset("Gaming", "valorant");
                    interestReactionRoleReset("Gaming", "phasmophobia");
                }
            }
            break;

        case setup.ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.ROLES.Teszter.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Teszter");
                }
            }
            break;

        case setup.ROLES.Spam.REACTION :
            if (reaction.message.id === setup.ROLES.Spam.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Spam");
                }
            }
            break;

        case setup.ROLES.Programozas.REACTION :
            if (reaction.message.id === setup.ROLES.Programozas.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Programozas");
                    interestReactionRoleReset("Programozas", "windows");
                    interestReactionRoleReset("Programozas", "mac");
                    interestReactionRoleReset("Programozas", "linux");
                    interestReactionRoleReset("Programozas", "git");
                    interestReactionRoleReset("Programozas", "c_cpp");
                    interestReactionRoleReset("Programozas", "java");
                    interestReactionRoleReset("Programozas", "python");
                    interestReactionRoleReset("Programozas", "c_sharp");
                    interestReactionRoleReset("Programozas", "web");
                    interestReactionRoleReset("Programozas", "javascript");

                }
            }
            break;

        case setup.ROLES.Gaming.CHANNELS.sim_racing.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "sim_racing");
            }
            break;
    }
    switch (reaction.emoji.id) {
        case setup.ROLES.Gaming.CHANNELS.minecraft.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "minecraft");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.paladins.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "paladins");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.rocket_league.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "rocket_league");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.pubg.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "pubg");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.csgo.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "csgo");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.r6s.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "r6s");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.among_us.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "among_us");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.fortnite.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "fortnite");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.ark.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "ark");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.fall_guys.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "fall_guys");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.gta.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "gta");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.league_of_legends.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "league_of_legends");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.lego.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "lego");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.valorant.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "valorant");
            }
            break;
        case setup.ROLES.Gaming.CHANNELS.phasmophobia.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "phasmophobia");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.windows.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "windows");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.mac.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "mac");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.linux.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "linux");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.git.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "git");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.c_cpp.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "c_cpp");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.java.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "java");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.python.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "python");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.c_sharp.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "c_sharp");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.web.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "web");
            }
            break;
        case setup.ROLES.Programozas.CHANNELS.javascript.EMOTE_ID:
            if (reaction.message.id === setup.ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "javascript");
            }
            break;
    }*/
    async function removeRole(object) {await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.ROLES[object].ROLE_ID);}
    async function interestRemoveRole(object, interest) {await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.ROLES[object].CHANNELS[interest].ROLE_ID);}
    async function roleAdd(object) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.ROLES[object].ROLE_ID);}
    function hasRole(object) {return reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.ROLES[object].ROLE_ID)}
    function userFound() {return !!reaction.message.guild.members.cache.get(user.id);}
    function removeRoleByID(id) {reaction.message.guild.members.cache.get(user.id).roles.remove(id);}
    function interestReactionRoleReset(object, interest) {console.log(setup.ROLES[object].CHANNELS_MESSAGE_ID); removeReaction(setup.ROLES[object].CHANNELS_CHANNEL_ID, setup.ROLES[object].CHANNELS_MESSAGE_ID, setup.ROLES[object].CHANNELS[interest].EMOTE_ID, user);}


});
bot.on('guildMemberAdd', (member) => {
    console.log(`m+ ${member.id} in class: ${!!isInThisClass(member)} bot: ${!!member.user.bot} guest: ${!!isGuest(member)}`);
    inappropriateGuild(member.guild);
    if (isInThisClass(member)) {
        member.roles.add(setup.ROLES.Unverified.ROLE_ID);
    } else if (member.user.bot) {
        member.roles.add(setup.ROLES.Bot.ROLE_ID);
    } else if (isGuest(member)) {
        member.roles.add(setup.ROLES.Vendeg.ROLE_ID);
    } else if (isPatron(member)) {
        member.roles.add(setup.ROLES.Patronus.ROLE_ID);
        member.setNickname(users.PATRONS.find(p => p.ID === member.id).NAME);
    } else {
        const raw = setup.NOT_IN_THIS_CLASS_MESSAGE;
        const dm = raw.replace(setup.USER_NAME, nicknameSearch(member.user)).replace(setup.SERVER_NAME, interaction.guild.name);
        member.send(dm).then(() => {member.kick();});

    }
});
bot.on('guildMemberRemove', async (member) => {
    console.log(`m- ${member.id}`);
    inappropriateGuild(member.guild);
    let publicmsg = setup.LEFT_PUBLIC_MESSAGE;
    let publicchannel = setup.ROLES.Rendszeruzenetek.CHANNEL_ID;

    if (publicmsg && publicchannel) {
        let channel = member.guild.channels.cache.find(val => val.name === publicchannel) || member.guild.channels.cache.get(publicchannel);
        if (!channel) {
            console.error(`Channel "${publicchannel}" not found`);
        } else {
            if (channel.permissionsFor(bot.user).has('SEND_MESSAGES')) {
                if (typeof publicmsg === "object") {
                    channel.send({
                        publicmsg
                    });
                } else {
                    let msg = publicmsg.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
                    channel.send(msg);
                }
            }
        }
    }
    
    function reactionRoleReset(object) {removeReaction(setup.ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.ROLES[object].MESSAGE_ID, setup.ROLES[object].REACTION, member);}

    /*reactionRoleReset("BOT");
    reactionRoleReset("Gaming");
    reactionRoleReset("Zene");
    reactionRoleReset("Spam");
    reactionRoleReset("Programozas");
    reactionRoleReset("Teszter");
    removeReaction(setup.ROLES.Verified.CHANNEL_ID, setup.ROLES.Verified.MESSAGE_ID, setup.ROLES.Verified.REACTION, member);*/
});

bot.on("guildMemberUpdate", (oldMember, newMember) => {

    if (oldMember.roles.cache.has(setup.ROLES.Gaming.ROLE_ID) && !(newMember.roles.cache.has(setup.ROLES.Gaming.ROLE_ID))) {
        for (const [key, value] of Object.entries(setup.ROLES.Gaming.CHANNELS)) { if (newMember.roles.cache.has(setup.ROLES.Gaming.CHANNELS[key].ROLE_ID)) newMember.roles.remove(setup.ROLES.Gaming.CHANNELS[key].ROLE_ID); }
    } else if (oldMember.roles.cache.has(setup.ROLES.Programozas.ROLE_ID) && !(newMember.roles.cache.has(setup.ROLES.Programozas.ROLE_ID))) {
        for (const [key, value] of Object.entries(setup.ROLES.Programozas.CHANNELS)) { if (newMember.roles.cache.has(setup.ROLES.Programozas.CHANNELS[key].ROLE_ID)) newMember.roles.remove(setup.ROLES.Programozas.CHANNELS[key].ROLE_ID); }
    }
});

clock.on('7:40', (date) => {
    console.log("success");
    now = new Date();
    birthday(now.getFullYear(), now.getMonth() + 1, now.getDate());
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let read;
let readChannel;
let readMessage;
rl.on('line', (input) => {
    read = input;
    readChannel = read.split(" ")[1];
    readMessage = replaceAll(read.split(" ").slice(2).join(' '), "\\\n", "\\n");
    switch(read.split(" ")[0]) {
        case "ch":
            bot.channels.fetch(readChannel).then(channel => {
                channel.send(readMessage);
            }).catch((channel) => console.error(channel));
            break;
        case "dm":
            bot.users.cache.get(readChannel).send(readMessage);
            break;
    }
});

bot.login();