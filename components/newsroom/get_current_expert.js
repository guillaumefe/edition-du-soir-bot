
module.exports = (app, db, redis) => {

    return {
        question: ["qui est l'expert de ce soir?", "qui est l'expert ce soir?"],
        answer : async() => {

            const entry = await redis.get('current expert')
            if (entry) {
                return ["L'expert actuel est " + entry]
            } else {
                return ["L'expert de ce soir n'est pas encore déterminé"]
            }
        }
    }
}
