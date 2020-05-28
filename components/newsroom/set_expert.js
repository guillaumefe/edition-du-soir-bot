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

            return await redis.set('current expert', env.pseudo).then(async (expert_set)=>{

                return await redis.get('current expert').then(async (expert_get)=>{

                    return await redis.set('current expert', env.pseudo).then(async ()=>{
                        return ["L'expert de ce soir est {{pseudo}}", "Entendu {{pseudo}} est l'expert de ce soir"]
                    })

                })

            })
        }
    }
}
