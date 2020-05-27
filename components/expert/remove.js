module.exports = (app, db, redis) => {

    return {
        question: 'retire l\'expert {{pseudo}}',
        answer : async (env) => {

            let result = await db.expert.asyncFind({ pseudo : env.pseudo })
            if(result.length) {
                const removed = db.expert.asyncRemove({ pseudo: env.pseudo }, {})
                return removed.then((removed, err)=>{
                    if(removed>0 && !err) {
                        return ["Ok j'ai retiré cet expert de la base de donnée", "C'est fait :)"]
                    } else {
                        return 'Il y a eu une erreur'
                    }
                })
            } else {
                return "Désolé je n'ai pas trouvé cet expert dans la base de donnée"
            }

        }
    }
}
