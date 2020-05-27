
module.exports = (app, db, redis) => {

    return {
        question: ["liste l'équipe", "liste de l'équipe", "qui est l'equipe de ce soir?", "qui est l'équipe ce soir?", "qui est l'équipe actuelle?", "liste les membres de l'équipe"],
        answer : async() => {

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

                return ["L'équipe actuelle est: " + team_members]

            } else {
                return ["L'équipe de ce soir n'est pas encore déterminée", "Il n'y personne dans l'équipe!"]
            }
        }
    }
}
