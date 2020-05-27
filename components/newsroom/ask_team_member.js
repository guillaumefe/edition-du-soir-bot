module.exports = (app, db, redis) => {

    return {
        question: [
            "demande à {{pseudo}} s'il souhaite faire partie de l'équipe"
        ],
        answer : async (env) => {

            // Post a message to the channel, and await the result.
            // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
            let user_id = env.pseudo.slice(2, env.pseudo.length-1)
            const result = app.client.conversations.open({
                token: process.env.TOKEN,
                users: user_id
            });

            let text = `
*Bonjour* :wave:

L'édition du soir aimerait que tu fasses partie de l'équipe de publication :smile:! Est-ce que ça te dit?
`

            let today = new Date();
            let blocks = [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": text
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Oui",
                                "emoji": true
                            },
                            "value": "oui"
                        }
                    ]
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "non",
                                "emoji": true
                            },
                            "value": "non"
                        }
                    ]
                }
            ]

            return result.then(()=>{
                return {
                    im: true,
                    blocks: [ blocks ],
                    channel: user_id
                }
            })

        }
    }
}
