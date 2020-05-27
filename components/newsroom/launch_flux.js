module.exports = (app, db, redis) => {

    return {
        question: ["ouvre", "ouvre l'édition", "lance l'édition", "lance l'edition de ce soir", "lance la discussion"],
        answer : async() => {


            const current = await redis.get('edition en cours')
            if(current.toString()) {
                return ["L'édition est déjà lancée " + current]
            }

            const main_channel = await redis.get('main channel')
            const channel = main_channel.match(/<(.*?)>/)[1]
            const channel_id = channel.split('|')[0].substring(1)
            const channel_name = channel.split('|')[1]

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
                channel: channel_id,
                text: prefix()+"-capture-quot"
            });

            let output = "Bonjour à tous, bienvenue dans cette nouvelle édition du soir."

            const entry = await redis.get('current expert')
            if (entry) {
                output += " "
                output += "L'expert de ce soir sera "+entry
            } else {
                return ["L'expert de ce soir n'est pas encore déterminé. À ce titre, je ne peux pas lancer l'édition. Vous pouvez me demander de continuer sans expert."]
            }

            const  list_team= await db.newsroom.asyncFind({ type: 'team' })
            if(list_team.length) {

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

            output = output.trim() + "." 

            const result2 = await app.client.chat.postMessage({
                token: process.env.TOKEN,
                channel: channel_id,
                thread_ts: result.message.ts,
                text: output 
            });

            const result3 = await app.client.chat.getPermalink({
                token: process.env.TOKEN,
                channel: channel_id,
                message_ts: result2.message.ts,
            });

            await redis.set('edition en cours', result3.permalink)
            out = "L'édition est lancée " + result3.permalink
            return out
        }
    }

}
