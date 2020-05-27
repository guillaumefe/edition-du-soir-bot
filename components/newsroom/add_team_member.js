module.exports = (app, db, redis) => {

    return {
        question: ["ajoute {{pseudo}} à l'équipe", "ajoute {{pseudo}} dans l'équipe"],
        answer : async (env) => {

            var doc = {
                'pseudo' : env.pseudo,
                'type' : 'team'
            }


            let result = await db.newsroom.asyncFind({ type: 'team', pseudo : env.pseudo })
            if(result && result.length) {
                
                return "{{pseudo}} est déjà dans l'équipe"

            } else {
                const prom = db.newsroom.asyncInsert(doc)

                return prom.then(async(newDoc, err)=>{
                    if (newDoc && newDoc.pseudo == doc.pseudo && !err) {
                        await redis.set('no_team', 'false')
                        flag = await redis.get('no_team')
                        if (!flag || flag !== false) {
                            return "Une erreur s'est produite"
                        }
                        return ["{{pseudo}} a été ajouté à l'équipe"]
                    } else {
                        return "Il y a eu une erreur l'ajout de {{pseudo}} à l'équipe"
                    }
                })
            }

        }
    }
}
