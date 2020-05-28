const moment = require('moment');

module.exports = (app, db, redis) => {

    return {
        question: ["ferme l'édition", 
            "ferme"
        ],
        answer : async (env) => {

            return await redis.get('edition en cours').then(async(entry)=>{

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

                    let d = new Date()
                    endtime = d.toLocaleTimeString('fr-FR', { hour12: false });
                    return await redis.set('edition en cours', '').then(async(result)=>{

                        return await redis.get('start time').then(async(startime)=>{

                            const duration = (e, s) => {
                                var t1 = moment(s, "hh:mm:ss");
                                var t2 = moment(e, "hh:mm:ss");
                                return Math.round(moment.duration(t2.diff(t1)).asMinutes())
                            }

                            let time_info = ''
                            const diff = await duration(endtime, startime)
                            if(diff > 1) {
                                time_info = "Ce bouclage a duré "+diff+" minutes. "
                            } else {
                                time_info = "Ce bouclage a duré "+diff+" minute. "
                            }

                            return await redis.get('current expert').then(async (expert)=>{
                                let expert_mention = ''
                                if(!expert || expert === 'none') {
                                    expert_mention = ''
                                } else {
                                    expert_mention = 'notre expert du soir '+expert+' ainsi qu\'à '
                                }
                                return await redis.set('current expert', '').then(async (result)=>{
                                    return ["L'édition est maintenant fermée. "+time_info+"Merci à "+expert_mention+team_members+" et à bientôt :wave:"]
                                })
                            }).catch((err)=>{
                                console.log(err)
                            })

                        })


                    })

                } else {
                    return ["Il n'y pas d'édition en cours"]
                }

            })
        }
    }
}
