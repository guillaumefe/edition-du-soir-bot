module.exports = (app, db, redis)=>{

    return {
        question: "on continue sans expert",
        answer : async()=>{

            result = await redis.set('current expert', 'none')
            entry = await redis.get('current expert')
            if (!entry || entry !== 'none') {
                return "Une erreur s'est produite"
            }
            return ["OK", "Bien reçu, pas d'expert pour ce soir"]
        }
    }
}
