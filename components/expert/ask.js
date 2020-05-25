module.exports = (db, app) => {

    return {
        question: [
            'demande à {{pseudo}} d\être un de nos experts', 
            'demande à {{pseudo}} d\'être notre expert',
            'demande à {{pseudo}} de faire partir de nos experts',
            'demande à {{pseudo}} de s\'inscrire comme expert',
            'demande à {{pseudo}} d\'être un expert',
            'demande à {{pseudo}} d\'être un expert de l\édition',
            'demande à {{pseudo}} d\'être un expert de l\édition du soir',
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

Je suis le robot de l' *Edition-du-soir* , un projet qui réside dans le canal #prj-reseaux-sociaux et qui est également diponible sur <https://www.github.com|Github>

Chaque jour nous trouvons un expert qui accepte de *commenter les données du jour*. Celles-ci sont collectées depuis le site <https://veille-coronavirus.fr|veille-coronavirus.fr> (un projet né ici et repris depuis par data.gouv)

Je t'écris dans le but de savoir si tu accepterais d'être *enregistré comme expert* pour l'une de nos édition? Si c'est le cas je t'invite à te référencer via le menu ci-dessous :)

Le principe est simple:
 1. Tu t'inscris pour une date
 2. À cette date, vers 19h15, nous prenons contact avec toi
 3. Tu prends le temps qu'il te faut pour écrire
 4. Nous fournirons une petite rédaction en chef
 5. Tu reçois les liens vers ton commentaire

Merci d'avance! :smile:
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
                    "type": "section",
                    "block_id": "section1234",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Choisis une date pour participer*"
                    },
                    "accessory": {
                        "type": "datepicker",
                        "action_id": "datepicker123",
                        "initial_date": today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date"
                        }
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Je serai là!",
                                "emoji": true
                            },
                            "value": "click_me_123"
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
