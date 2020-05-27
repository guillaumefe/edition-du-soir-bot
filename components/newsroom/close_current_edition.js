module.exports = (app, db, redis) => {

    return {
        question: ["ferme l'édition", 
            "ferme"
        ],
        answer : async (env) => {

            entry = await redis.get('edition en cours')
            if (entry && entry.length) {

                let team_members = " "
                const  list_team= await db.newsroom.asyncFind({ type: 'team' })
                if(list_team && list_team.length) {

                    //sort alphabetically
                    list_team.sort(function(a, b) {
                        var textA = a.pseudo.toUpperCase();
                        var textB = b.pseudo.toUpperCase();
                        return (textA >= textB) ? -1 : (textA < textB) ? 1 : 0;
                    });

                    for (member in list_team) {
                        team_members += list_team[member].pseudo+" "
                    }
                }

                result = await redis.set('edition en cours', '')
                return ["L'édition est maintenant fermée. Merci à tous"+team_members+" et à bientôt :wave:"]
            } else {
                return ["Il n'y pas d'édition en cours"]
            }
        }
    }
}
