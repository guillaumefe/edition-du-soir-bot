
module.exports = (db, app, config) => {

    return {

        question: ["quel est notre principal channel?", 
            "quel est le principal channel?", 
            "est ce que {} est notre principal channel?", 
            "est ce que {} c est notre principal channel?", 
            "{} est il le channel principal?", 
            "{} est il le principal channel?", 
            "le principal channel est il {}?", 
            "le principal channel est ce {}?"],
        answer : async (env) => {

            entry = await config.get('main channel')
            return ["Le channel principal est actuellement " + entry]
        }
    }
}
