module.exports = (app, db, redis) => {

    return {
        question: ["ouvre", "ouvre l'édition", "lance l'édition", "lance l'edition de ce soir", "lance la discussion"],
        answer : async() => {

            const current = await redis.get('edition en cours')
            if(current && current.toString()) {
                return ["L'édition est déjà lancée " + current]
            }

            const main_channel = await redis.get('main channel')

            if(!main_channel) {
                return ["Tout d'abord il faut m'indiquer le principal channel"]
            }

            let channel, channel_name
            try {
                channel = main_channel.match(/<(.*?)>/)[1]
                //const channel_id = channel.split('|')[0].substring(1)
                channel_name = channel.split('|')[1]
            } catch(e) {
                channel_name = main_channel
            }

            function prefix(date) {
                var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [day, month].join('-');
            }

            // 26-05-capture-quot
            const result = await app.client.chat.postMessage({
                token: process.env.TOKEN,
                channel: channel_name,
                text: prefix()+"-capture-quot"
            });

            let output = "Bonjour à tou.te.s :wave:, bienvenue dans cette nouvelle édition du soir"

            return await redis.get('current expert').then(async(expert)=>{

                if (expert && expert !== 'none') {
                    output += ". L'expert de ce soir sera "+expert
                } else if (expert !== 'none') {
                    return ["L'expert de ce soir n'est pas encore déterminé. À ce titre, je ne peux pas lancer l'édition. Vous pouvez me demander de continuer sans expert."]
                }

                const  list_team = await db.newsroom.asyncFind({ type: 'team' })
                if(list_team && list_team.length) {

                    //sort alphabetically
                    list_team.sort(function(a, b) {
                        var textA = a.pseudo.toUpperCase();
                        var textB = b.pseudo.toUpperCase();
                        return (textA >= textB) ? -1 : (textA < textB) ? 1 : 0;
                    });

                    output += ", avec l'équipe " 
                    for (member in list_team) {
                        output += list_team[member].pseudo+" "
                    }
                } 
                else if(await redis.get('no_team') !== "true") {
                    return ["L'équipe de ce soir n'est pas encore déterminé. À ce titre, je ne peux pas lancer l'édition. Vous pouvez me demander de continuer sans équipe."]
                }

                output = output.trim() + "." 

                return await app.client.chat.postMessage({
                    token: process.env.TOKEN,
                    channel: channel_name,
                    thread_ts: result.message.ts,
                    text: output 
                }).then(async (data)=>{

                    return await app.client.chat.getPermalink({
                        token: process.env.TOKEN,
                        channel: data.channel,
                        message_ts: data.message.ts,
                    }).then(async (data2)=> {
                        return await redis.set('edition en cours', data2.permalink).then(async(doc)=>{
                            let d = new Date()
                            startime = d.toLocaleTimeString('fr-FR', { hour12: false });
                            return await redis.set('start time', startime).then(async(doc)=>{
                                return ["L'édition est lancée " + data2.permalink]
                            })
                        })
                    }).catch((e)=>{
                        console.error(e)
                    });

                }).catch((e)=>{
                    console.error(e)
                });

            });


        }
    }

}
