
module.exports = (app, db, redis) => {

    return {
        question: ["notre principal channel est {{channel}}", 
            "xxx {{channel}}",
            "{{channel}} est notre principal channel", 
            "{{channel}} est le channel principal", 
        "le principal channel est {{channel}}", 
            "le principal channel c'est {{channel}}"
        ],

        answer : async (env) => {

            let channel, channel_name
            try {
                channel = env.channel.match(/<(.*?)>/)[1]
                channel_name = channel.split('|')[1]
            } catch (e) {
                channel_name = env.channel.substring(1)
            }

            console.log(channel_name)
            const list = await app.client.conversations.list({
                // The token you used to initialize your app
                token: process.env.TOKEN,
                types: "public_channel,private_channel"
            });

            let FLAG = false
            list.channels.forEach(function(conversation){
                // Key conversation info on its unique ID
                name = conversation["name"];
                console.log(name)
                if (name === channel_name) {
                    FLAG = true
                }
            })

            if (FLAG == true) { // channel has been found
                result = await redis.set('main channel', env.channel)
                entry = await redis.get('main channel')
                if (entry === env.channel) {
                    return ["OK", "OK c'est fait", "J'ai mis à jour le principal channel"]
                } else {
                    return "Une erreur s'est produite. Le principal channel est " + entry
                }
            } else {
                return ["Désolé ce channel n'existe pas"]
            }

        }
    }
}
