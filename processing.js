// This file is quite a mess, it needs refactoring
// What you will find:
// - db creation (currently it creates only a list of experts, in db.expert
// - comparaison fonction : used to find out if the given question match one of our pre-recorded question
// - main : import dialogs from components folder and generate a bit of documentation at start
// - main returns the payload that is used to actually look for an ansxer
//
//
// If you wish to add question
// 1. create and cd in a folder in components or cd into one existing
// 2. create a file index.js if there is no such file in the folder you are
// 3. create a file my_command.js
// 4. add content to my_command.js (a simple module.export = { question: 'my question', answer: 'my answer'} does the trick, but there is many other way since the currenc code undestands : arrays, functions)
// 5. reference my_command.js in index.js
// 6. reference your folder (if you have created it) in components/index.js
// 7. start the app (should be ok)

// Note that, in case of error from your components, edition-bot will tell ya

const components = require('./components')
const Mustache = require('mustache')
const store = require('./db')

const db = {
    expert : store('expert'),
    newsroom : store('newsroom')
}

const asyncRedis = require("async-redis");
const redis = asyncRedis.createClient(process.env.REDIS_URL);

redis.on("error", function(error) {
  console.error("Redis Error: " + error);
});

function compare(s1, s2) {

    var s1Parts= s1.split(/ +/);
    var s2Parts= s2.split(/ +/);

    if(s1Parts.length !== s2Parts.length) {
        return {
            ok: false,
            env: {}
        }
    }

    var score = 0;
    var variables = 0;
    var dict = {}
    var closest = false

    for(var i = 0; i<s2Parts.length; i++)
    {

        if(s2Parts[i].startsWith("{{")) {
            dict[s2Parts[i].slice(2, s2Parts[i].length-2)] = s1Parts[i]
            variables++
            if(s1Parts[i] === undefined) {
                return {
                    ok: false,
                    env: {}
                }
            }
            continue
        } 

        if(s1Parts[i] === s2Parts[i]) {
            score++;
        }
    }

    let result = s2Parts.length - variables
    if (!result) dict = {}

    if((score/(s2Parts.length - variables))*100 > 40) {
        closest = true
    }

    return {
        ok: score == result,
        env: dict,
        closest: closest
    }
}

function main(bot) {

    //generate dialogs
    const dialogs = []
    const help = []
    for (attr in components) {
        for (sub in components[attr]) {
            //console.log('##################')
            //console.log("DOMAIN", sub)
            //console.log('##################')
            
            for (bundle in components[attr][sub]) {

                if (typeof components[attr][sub][bundle] === 'function') {
                    //Instanciates component
                    components[attr][sub][bundle]= components[attr][sub][bundle](bot, db, redis)
                }

                if(Array.isArray(components[attr][sub][bundle].question)) {
                    for( i in components[attr][sub][bundle].question){
                        console.log('-', components[attr][sub][bundle].question[i])
                    }
                } else {
                    console.log('-', components[attr][sub][bundle].question)
                }

                //Help

                if(typeof components[attr][sub][bundle].answer === 'function') {
                    if(Array.isArray(components[attr][sub][bundle].question)) {
                        help.push(components[attr][sub][bundle].question[0])
                    } else if (typeof components[attr][sub][bundle].question === 'string'){
                        help.push(components[attr][sub][bundle].question)
                    }
                }
                //console.log("COMMANDE : ", components[attr][sub][bundle].question)
                //console.log("REPONSE : ", components[attr][sub][bundle].answer)
                //console.log('------------')

                dialogs.push(components[attr][sub][bundle])
            }
        }
    }

    return async (question, event) => {

        let bundle, env;
        let closest = []

        // hooks
        if (question === 'aide') {
            return  {
                text: 'Edition Aide',
                blocks: (()=>{
                    let aide_q = []
                    for (let i=0; i<help.length-1; i++) {
                        aide_q.push({
                            "type": "context",
                            "elements": [
                                {
                                    "type": "mrkdwn",
                                    "text": "- " + help[i]
                                }
                            ]
                        })
                    }
                    let header = {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*:brain: "+help.length+" requêtes que vous pouvez m'adresser*"
                        }
                    }
                    aide_q.unshift(header)
                    return aide_q
                })(),
                channel: event.channel,
                thread_ts: event.thread_ts
            }
        }

        for (obj in dialogs) {
            if (!bundle) {
                let _bundle = dialogs[obj]
                let array = (Array.isArray(_bundle.question))?_bundle.question:[_bundle.question]
                for(entry in array) {
                    let diff = compare(question, array[entry])
                    if(diff.ok) {
                        bundle = _bundle
                        env = diff.env
                        break
                    } else {
                        if(diff.closest === true) {
                            closest.push(array[entry]) 
                        }
                    }
                }
            }
        }

        if (!bundle) {
            bundle = {
                answer: "Je suis désolé, je n'ai pas compris cette question ```"+question+"```",
                blocks: [],
                unsure : true
            }
        }

        let _a = bundle.answer

        let options = {
        }

        if(typeof _a === 'function') {
            try {
                _a = await _a(env).then((_b) => {

                    if (Array.isArray(_b)) {
                        return _b
                    } else if(typeof _b === 'object') {

                        // Handle specific options
                        // options = _b  //unsecure
                        if(_b["channel"]) options["channel"] = _b["channel"]
                        if(_b["im"]) options["im"] = _b["im"] //use it if you target an IM conversation, it will remove thread reference, i
                        //otherwise msg fails to be send !important

                        if(_b.text) return _b.text
                        if(_b.blocks) return _b.blocks

                    } else {
                        return _b
                    }

                })
            } catch {
                //_a = _a(env)
            }
        }

        //pick random answer
        let answers = (Array.isArray(_a))?_a:[_a]
        const rand = Math.floor(Math.random() * answers.length)
        let answer = answers[rand]

        let text, blocks
        if(typeof answer == 'string') {
            text = Mustache.render(answer, env)
            blocks = []
        } else {
            text = ''
            blocks = answer
        }

        if (bundle.unsure === true) {
            if(closest && closest.length) {
                text += "\nVoici quelques questions proches ```"+closest.join(', ')+"```"
            } else {
                text += "\nVoici quelques questions que vous pourriez me poser ```"+help.join(', ').replace(/, $/, '')+"```"
            }
        }

        return  {
            text: text,
            blocks: blocks,
            channel: options.channel || event.channel,
            thread_ts: (options.im) ? undefined : (options.thread_ts || event.thread_ts),
        }

    }

}

module.exports = main
