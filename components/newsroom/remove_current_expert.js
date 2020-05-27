module.exports = (app, db, redis) => {

    return {
        question: [
            "annule l'expert de ce soir", 
            "retire l'expert de ce soir", 
        ],
        answer : async (env) => {

            result = await redis.set('current expert', '')
            entry = await redis.get('current expert')
            if (entry === '') {
                return ["L'expert de ce soir a bien été annulé"]
            } else {
                return "Une erreur s'est produite"
            }
        }
    }
}
