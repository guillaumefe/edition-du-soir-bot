require('dotenv').config()

const { App } = require('@slack/bolt');

const bot = new App({
  signingSecret: process.env.SECRET,
  token: process.env.TOKEN,
});

const answer = require('./processing.js')(bot)

bot.event("app_home_opened", async ({ context, event }) => {
    console.log('home opened')
})

bot.event("message.app_home", async ({ context, event }) => {
    console.log('oui')
})

bot.event("app_mention", async ({ context, event }) => {

     console.log(context)
     console.log(event)

      //const bot_name = '<@U014C1THMQC>'
      const bot_name = '<@'+context.botUserId+'>'
      question = event.text.trim().replace(bot_name, '').trim();
      const answ = await answer(question, event)

  try{
      await bot.client.chat.postMessage({
          token: context.botToken,
          channel: answ.channel,
          thread_ts: answ.thread_ts,
          text: answ.text + "<@"+event.user+">",
          blocks: answ.blocks,
          icon_emoji: "female-technologist"
      });
  } catch (e) {
        //await bot.client.chat.postMessage({
        await bot.client.chat.postMessage({
            token: context.botToken,
            channel: event.channel,
            thread_ts: event.thread_ts,
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":warning: `"+e.message+"` `"+JSON.stringify(answ)+"`" + " <@"+event.user+">"
                    }
                },
            ]
        }).then((res)=>{
            //console.log(res)
        }).catch((err)=>{
            //console.log(err)
        });
        console.log(`error responding ${e}`);
    }

});

(async () => {
    // Start the app
    await bot.start(process.env.PORT || 3000);

    console.log('⚡️ Edition is running');
})();
