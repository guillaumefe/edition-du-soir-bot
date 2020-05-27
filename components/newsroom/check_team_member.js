module.exports = (app, db, redis) => {

    return {
        question: ["est-ce que {{pseudo}} est dans l'équipe?", "est-ce que {{pseudo}} fait partie de l'équipe?"],
        answer : async (env) => {

            let result = await db.newsroom.asyncFind({ type: 'team', pseudo : env.pseudo })
            if(result.length) {
                
                if (result.length > 1) {
                    return "Oui, mais attention :warning: {{pseudo}} est inscrit plusieurs fois dans l'équipe ('+result.length+' fois)"
                } else {
                    return ["Oui, {{pseudo}} est dans l'équipe", "Oui, {{pseudo}} fait partie de l'équipe", "Oui", "Bien sûr", "C'est le cas"]
                }

            } else {
                    return "Non, {{pseudo}} ne fait pas partie de l'équipe"
            }

        }
    }
}
