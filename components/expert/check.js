module.exports = (app, db, redis) => {

    return {
        question: ["est-ce que {{pseudo}} est dans la liste des experts?", "est-ce que {{pseudo}} est enregistré comme expert?", "est-ce que {{pseudo}} est un expert?"],
        answer : async (env) => {

            let result = await db.expert.asyncFind({ pseudo : env.pseudo })
            if(result.length) {
                
                if (result.length > 1) {
                    return 'Oui, mais attention :warning: {{pseudo}} est inscrit plusieurs fois dans la liste des experts ('+result.length+' fois)'
                } else {
                    return 'Oui, {{pseudo}} est dans la liste des experts'
                }

            } else {
                    return 'Non, {{pseudo}} n\'est pas dans la liste des experts'
            }

        }
    }
}
