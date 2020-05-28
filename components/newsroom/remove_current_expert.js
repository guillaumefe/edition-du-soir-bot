module.exports = (app, db, redis) => {

    return {
        question: [
            "annule l'expert de ce soir", 
            "retire l'expert de ce soir", 
        ],
        answer : async (env) => {

            return await redis.set('current expert', '').then(async (result)=>{

                return await redis.get('current expert').then(async (entry)=>{

                    if (entry === '') {
                        return ["L'expert de ce soir a bien été annulé"]
                    } else {
                        return "Une erreur s'est produite : la tentative de vider la variable expert dans la abse de données redis a échoué"
                    }

                })
            })
        }
    }
}
