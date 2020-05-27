module.exports = (app, db, redis) => {

    return {
        question: ["ajoute {{pseudo}} comme expert", "ajoute l'expert {{pseudo}}"],
        answer : async (env) => {

            var doc = {
                'pseudo' : env.pseudo,
                'nom' : '',
                'prenom' : '',
                'job' : '',
                'contact' : {
                    'linkedin' : '',
                    'facebook' : '',
                    'twitter' : '',
                    'github' : '',
                    'autre' : ''
                }
            }


            let result = await db.expert.asyncFind({ pseudo : env.pseudo })
            if(result && result.length) {
                
                return 'Le pseudonyme {{pseudo}} est déjà inscrit comme expert'

            } else {
                const prom = db.expert.asyncInsert(doc)

                return prom.then((newDoc, err)=>{
                    if (newDoc && newDoc.pseudo == doc.pseudo && !err) {
                        return ["L'expert {{pseudo}} a été ajouté à la liste des experts"]
                    } else {
                        return "Il y a eu une erreur lors de l'insertion du nouvel expert dans la base"
                    }
                })
            }

        }
    }
}
