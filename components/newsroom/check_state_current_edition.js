module.exports = (app, db, redis) => {

    return {
        question: ["l'édition est-elle lancée?", 
            "est-ce-que l'édition est lancée?",
            "est ce que l'édition est lancée?",
            "est-ce-qu'il y a une édition en cours?",
            "est ce qu'il y a une édition en cours?",
            "est-ce-qu'il y a une édition en ce moment?",
            "est-ce qu'il y a une édition en ce moment?",
            "est-ce-qu'il y a une édition actuellement?",
            "est ce qu'il y a une édition actuellement?",
            "y a-t-il une édition en cours?",
            "y a t il une édition en cours?",
            "y a t il une édition en ce moment?",
            "y a-t-il une édition en ce moment?",
            "y a t il une édition actuellement?",
            "y a-t-il une édition actuellement?",
            "l'édition est-elle lancée?",
            "l'édition est elle lancée?"
        ],
        answer : async (env) => {

            entry = await redis.get('edition en cours')
            if (entry.length) {
                return ["Oui, l'édition est lancée " + entry]
            } else {
                return ["Non pas encore", "Non il n'y pas d'édition en cours"]
            }
        }
    }
}
