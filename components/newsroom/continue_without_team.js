module.exports = (app, db, redis)=>{

    return {
        question: [
            "on continue sans équipe",
            "continue sans équipe"
        ],
        answer : async()=>{

            let team_members = " "
            const  list_team= await db.newsroom.asyncFind({ type: 'team' })
            if(list_team && list_team.length) {

                return ["Il y a une équipe! Il s'agit de " + team_members]

            } else {
                result = await redis.set('no_team', 'true')
                entry = await redis.get('no_team')
                if (!entry || entry !== 'true') {
                    return "Une erreur s'est produite"
                }
                return ["OK", "Bien reçu, pas d'equipe pour ce soir"]
            }


        }
    }
}
