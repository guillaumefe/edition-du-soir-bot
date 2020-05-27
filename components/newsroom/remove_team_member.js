module.exports = (app, db, redis) => {

    return {
        question: "retire {{pseudo}} de l'équipe",
        answer : async (env) => {

            let result = await db.newsroom.asyncFind({ type: 'team', pseudo : env.pseudo })
            if(result.length) {
                const removed = db.newsroom.asyncRemove({ type: 'team', pseudo: env.pseudo }, {})
                return removed.then((removed, err)=>{
                    if(removed>0 && !err) {
                        return ["Ok j'ai retiré {{pseudo}} de l'équipe", "C'est fait :)"]
                    } else {
                        return 'Il y a eu une erreur'
                    }
                })
            } else {
                return "Désolé je n'ai pas trouvé {{pseudo}} dans l'équipe"
            }

        }
    }
}
