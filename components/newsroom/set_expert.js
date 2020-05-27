module.exports = (app, db, redis) => {

    return {
        question: ["designe {{pseudo}} comme expert ce soir", 
            "designe {{pseudo}} comme étant expert ce soir",
            "designe {{pseudo}} comme étant l'expert ce soir",
            "designe {{pseudo}} comme étant l'expert de ce soir",
            "designe {{pseudo}} comme expert",
            "{{pseudo}} est l'expert de ce soir",
            "{{pseudo}} est l'expert ce soir",
            "{{pseudo}} est expert de ce soir",
            "{{pseudo}} est expert ce soir",
            "ce soir l'expert est {{pseudo}}",
            "l'expert de ce soir est {{pseudo}}",
            "l'expert ce soir est {{pseudo}}"
        ],
        answer : async (env) => {

            result = await redis.set('current expert', env.pseudo)
            entry = await redis.get('current expert')
            if (entry === env.pseudo) {
                return ["L'expert de ce soir est {{pseudo}}", "Entendu {{pseudo}} est l'expert de ce soir"]
            } else {
                return "Une erreur s'est produite"
            }
        }
    }
}
