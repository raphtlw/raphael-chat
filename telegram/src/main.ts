require("dotenv").config();
import { Telegraf, Extra } from "telegraf";
import got from "got";

const bot = new Telegraf(process.env.BOT_TOKEN);
// const EOS_TOKEN = "<|endoftext|>";
// let maxTurnsHistory = 2;
let turns: Turn[] = [{ user_messages: [], bot_messages: [] }];

bot.start((ctx) => {
  turns = [];
  ctx.reply("Hey, what's up?");
});

async function chat(message: string) {
  // if (maxTurnsHistory === 0) {
  //   turns = [];
  //   return;
  // }

  // const turn: Turn = {
  //   userMessages: [],
  //   botMessages: [],
  // };
  // turns.push(turn);
  // turn.userMessages.push(message);
  // let prompt = "";
  // const fromIndex =
  //   maxTurnsHistory >= 0 ? Math.max(turns.length - maxTurnsHistory - 1, 0) : 0;
  // for (const turn of turns.slice(fromIndex)) {
  //   for (const userMessage of turn.userMessages) {
  //     prompt += userMessage + EOS_TOKEN;
  //   }
  //   for (const botMessage of turn.botMessages) {
  //     prompt += botMessage + EOS_TOKEN;
  //   }
  // }

  // console.log(prompt);

  const botMessage = await (async () => {
    const response = await got.post<{ turns: Turn[]; bot_message: string }>(
      process.env.BRAIN_URL,
      {
        json: { turns: turns, user_message: message },
        responseType: "json",
      }
    );
    turns = response.body.turns;
    return response.body.bot_message;
  })();

  console.log(botMessage);

  return botMessage;
}

bot.on("text", async (ctx) => {
  try {
    if (ctx.chat.type === "private") {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing");
      console.log(`Recieved: ${ctx.message.text} (private)`);
      const reply = await chat(ctx.message.text);
      await ctx.reply(reply);
    }
  } catch (e) {
    console.log(e);
  }
});

bot.telegram.setWebhook("https://telegram-5g5wk2xfdq-as.a.run.app/webhook");
bot.startWebhook("/webhook", null, 8443, "0.0.0.0");

interface Turn {
  user_messages: string[];
  bot_messages: string[];
}
