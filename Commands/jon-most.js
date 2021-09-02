const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'jon-most',
    description: 'writes out the next or the current lesson',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, opts, users, timetable, bot, type) {
        const now = new Date();
        let index = null;
        const week_eng_it = timetable.WEEK.ENG_IT;
        const week_art = timetable.WEEK.ART;
        let meet;
        let classroom;
        const time = new Date();
        let temp = new Date();
        temp.setHours(23);
        temp.setMinutes(59);
        const from = new Date();
        const to = new Date();
        let breakDuration;
        if (type !== "jon" && type !== "most") return;

        const args = {
            user: opts.get('user')
        }

        function getWeekNumber(d) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        }

        function whichLanguage(lesson) {
            let arr = lesson.split("/");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === languageSearch()) {
                    arr[i] = `__${arr[i]}__`
                    meet = timetable.MEET[languageSearch()];
                    classroom = timetable.CLASSROOM[languageSearch()];
                    return arr.toString().replace(",", "/").replace("[", "").replace("]", "");
                }
            }
        }

        function whichLesson(lesson) {
            let arr = lesson.split("/");
            if (getWeekNumber(now) % 2 === week_eng_it) {
                if (now.getDay() === 1) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G1;
                            classroom = timetable.CLASSROOM.Angol.G1;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G2;
                            classroom = timetable.CLASSROOM.Info.G2;
                            break;
                    }
                } else if (now.getDay() === 2) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G1;
                            classroom = timetable.CLASSROOM.Info.G1;
                            break;
                        case 2:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G2;
                            classroom = timetable.CLASSROOM.Angol.G2;
                            break;
                    }
                }
            } else {
                if (now.getDay() === 2) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G1;
                            classroom = timetable.CLASSROOM.Angol.G1;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G2;
                            classroom = timetable.CLASSROOM.Info.G2;
                            break;
                    }
                } else if (now.getDay() === 1) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G1;
                            classroom = timetable.CLASSROOM.Info.G1;
                            break;
                        case 2:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G2;
                            classroom = timetable.CLASSROOM.Angol.G2;
                            break;
                    }
                }
            }
            return arr.toString().replace(",", "/").replace("[", "").replace("]", "");
        }

        function whichArt(lesson) {
            classroom = timetable.CLASSROOM.Kommunikáció;
            let arr = lesson.split("/");
            if (getWeekNumber(now) % 2 === week_art) {
                return arr[0];
            } else {
                return arr[1];
            }
        }

        function nextLesson(lesson, type) {
            switch (type) {
                case "L":
                    return whichLanguage(lesson);
                case "I":
                    return whichLesson(lesson);
                case "A":
                    return whichArt(lesson);
                default:
                    if (lesson === "Tesi") {
                        switch (users.USERS[userSearch()].GENDER) {
                            case "M":
                                meet = timetable.MEET[lesson].BOYS;
                                classroom = timetable.CLASSROOM[lesson].BOYS;
                                break;
                            case "F":
                                meet = timetable.MEET[lesson].GIRLS;
                                classroom = timetable.CLASSROOM[lesson].GIRLS;
                                break;
                        }
                    } else if (lesson === "Angol") {
                        switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                            case 1:
                                meet = timetable.MEET[lesson].G1;
                                classroom = timetable.CLASSROOM[lesson].G1;
                                break;
                            case 2:
                                meet = timetable.MEET[lesson].G2;
                                classroom = timetable.CLASSROOM[lesson].G2;
                                break;
                        }
                    } else {
                        meet = timetable.MEET[lesson];
                        classroom = timetable.CLASSROOM[lesson];
                    }
                    return lesson;
            }
        }

        function languageSearch() {
            for (let index = 0; index < users.USERS.length; index++) {
                if (users.USERS[index].USER_ID === interaction.member.user.id) {
                    for (let i = 0; i < timetable.LANGUAGES.length; i++) {
                        if (timetable.LANGUAGES[i].CHAR === users.USERS[index].SUBJECTS.LANGUAGE) {
                            return timetable.LANGUAGES[i].SUBJECT;
                        }
                    }
                }
            }
        }

        function typeSearch() {
            for (let index = 0; index < timetable.TIMETABLE[now.getDay()-1].length; index++) {
                if (timetable.TIMETABLE[now.getDay()-1][index].TYPE !== null) {
                    return timetable.TIMETABLE[now.getDay()-1][index].TYPE;
                }
            }
        }

        function userSearch() {
            for (let i = 0; i < users.USERS.length; i++) {
                if (users.USERS[i].USER_ID === interaction.member.user.id) {
                    return i;
                }
            }
        }

        if (now.getDay() !== 6 && now.getDay() !== 0) {
            switch (type) {
                case "jon":
                    for (let i = 0; i < timetable.TIMETABLE[now.getDay() - 1].length; i++) {
                        time.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                        time.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                        if (time < temp && time > now) {
                            temp.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                            temp.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                            index = i;
                        }
                        if (i + 1 < timetable.TIMETABLE[now.getDay() - 1].length) {
                            to.setHours(timetable.TIMETABLE[now.getDay() - 1][i + 1].TIME.FROM.HOUR);
                            to.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i + 1].TIME.FROM.MINUTE);
                            if (time <= now && now < to) {
                                breakDuration = timetable.TIMETABLE[now.getDay() - 1][i].TIME.TO.MINUTE - timetable.TIMETABLE[now.getDay() - 1][i + 1].TIME.FROM.MINUTE;
                            }
                        }
                    }
                    break;
                case "most":
                    for (let i = 0; i < timetable.TIMETABLE[now.getDay() - 1].length; i++) {
                        from.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                        from.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                        to.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.TO.HOUR);
                        to.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.TO.MINUTE);
                        if (from <= now && now < to) {
                            index = i;
                        }
                    }
                    break;
            }

            if (index != null) {
                const Embed = new Discord.MessageEmbed()
                    .setTitle(`**${type === "jon" ? `A következő óra ma` : type === "most" ? `A most zajló óra` : ""}${args.user ? ` (user ${args.user.value})` : ""}:**`)
                    .setDescription(`**${nextLesson(timetable.TIMETABLE[now.getDay() - 1][index].LESSON, timetable.TIMETABLE[now.getDay()-1][index].TYPE)}**`)
                    .addField('Idő:', `${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.HOUR}:${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.MINUTE} - ${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.HOUR}:${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.MINUTE}`)
                    .addField('Óra hossza:', `${(timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.MINUTE + (timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.HOUR * 60)) - (timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.MINUTE + (timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.HOUR * 60))} perc`)
                    .setColor('RANDOM')
                    .setFooter("Ha több óra is van párhuhamosan, akkor az aláhúzott lesz a tiéd.\nEzért nem is biztos, hogy ami másnak ki lett írva, az neked is jó!");
            
                //if (args.user) {
                    if (classroom) classroom = `https://classroom.google.com${args.user ? `/u/${args.user.value}` : ""}/c/${classroom}`;
                    if (meet) meet = `https://meet.google.com/lookup/${meet}${args.user ? `?authuser=${args.user.value}` : ""}`;
                //}

                let comparisonDate = new Date();
                comparisonDate.setHours(timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.HOUR);
                comparisonDate.setMinutes(timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.MINUTE)
                comparisonDate.setSeconds(0);

                let timeDiff = Math.abs(new Date() - comparisonDate);
                let timeDiffStr = "";
                if (timeDiff >= 3600000) timeDiffStr += `${Math.floor(timeDiff / 3600000)} óra `;
                if (timeDiff >= 60000) timeDiffStr += `${Math.floor((timeDiff / 60000)) % 60} perc `;
                if (timeDiff >= 1000) timeDiffStr += `${Math.floor((timeDiff / 1000)) % 60} másodperc`;

                switch (type) {
                    case "jon":
                        Embed.addField("Ennyi idő múlva:", timeDiffStr);

                        if (index !== 0) {
                            timeDiffStr = "";
                            breakDuration = Math.abs(breakDuration);
                            if (breakDuration >= 60) timeDiffStr += `${Math.floor(breakDuration / 60)} óra `;
                            if (breakDuration >= 0) timeDiffStr += `${Math.floor((breakDuration)) % 60} perc `;
                            Embed.addField("Szünet előtte:", timeDiffStr);
                        }
                        break;
                    case "most":
                        Embed.addField("Ennyi ideje:", timeDiffStr);

                        comparisonDate = new Date();
                        comparisonDate.setHours(timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.HOUR);
                        comparisonDate.setMinutes(timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.MINUTE)
                        comparisonDate.setSeconds(0);

                        timeDiff = Math.abs(new Date() - comparisonDate);
                        timeDiffStr = "";
                        if (timeDiff >= 3600000) timeDiffStr += `${Math.floor(timeDiff / 3600000)} óra `;
                        if (timeDiff >= 60000) timeDiffStr += `${Math.floor((timeDiff / 60000)) % 60} perc `;
                        if (timeDiff >= 1000) timeDiffStr += `${Math.floor((timeDiff / 1000)) % 60} másodperc`;

                        Embed.addField("Hátravan:", timeDiffStr);
                        break;
                
                    default:
                        break;
                }
                let toSend = {
                    embeds: [Embed]
                };

                if (timetable.TIMETABLE[now.getDay() - 1][index].DESCRIPTION !== "") {
                    Embed.addField('Megjegyzés:', `${timetable.TIMETABLE[now.getDay() - 1][index].DESCRIPTION}`);
                }
                if (meet || classroom) {
                    const row = new Discord.MessageActionRow();
                    if (classroom) {
                        row.addComponents(
                            new Discord.MessageButton()
                                .setLabel("Classroom")
                                .setStyle("LINK")
                                .setURL(classroom)
                        )
                    }
                    if (meet) {
                        row.addComponents(
                            new Discord.MessageButton()
                            .setLabel("Meet")
                            .setStyle("LINK")
                            .setURL(meet)
                        )
                    }
                    toSend.components = [row];
                }
                interaction.reply(toSend);
            } else {
                interaction.reply(type === "jon" ? "Ma nincs több óra!" : type === "most" ? "Most nincs óra!" : "");
            }

        } else {
            interaction.reply("Hétvégén nincs óra!");
        }
    }
}
