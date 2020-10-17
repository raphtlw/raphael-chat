require("dotenv").config();
import { Telegraf, Extra } from "telegraf";
import got from "got";

const bot = new Telegraf(process.env.BOT_TOKEN);
const EOS_TOKEN = "<|endoftext|>";
let maxTurnsHistory = 1;
let turns: Turn[] = [];

bot.start((ctx) => {
  ctx.reply("Hi");
});

async function chat(message: string) {
  if (maxTurnsHistory === 0) {
    turns = [];
    return;
  }

  const turn: Turn = {
    userMessages: [],
    botMessages: [],
  };
  turns.push(turn);
  turn.userMessages.push(message);
  let prompt = "";
  const fromIndex =
    maxTurnsHistory >= 0 ? Math.max(turns.length - maxTurnsHistory - 1, 0) : 0;
  for (const turn of turns.slice(fromIndex)) {
    for (const userMessage of turn.userMessages) {
      prompt += userMessage + EOS_TOKEN;
    }
    for (const botMessage of turn.botMessages) {
      prompt += botMessage + EOS_TOKEN;
    }
  }

  const botMessage = await got.post(process.env.BRAIN_URL, {
    json: { prompt: prompt },
    responseType: "json",
  });

  console.log(botMessage);

  return "test";
}

bot.on("text", (ctx) => {
  try {
    if (ctx.chat.type === "private") {
      console.log(`Recieved: ${ctx.message.text} (private)`);
      chat(ctx.message.text).then((reply: string) => ctx.reply(reply));
    }
  } catch (e) {
    console.log(e);
  }
});

bot.telegram.setWebhook("https://telegram-5g5wk2xfdq-as.a.run.app/webhook");
bot.startWebhook("/webhook", null, 8443, "0.0.0.0");

interface Turn {
  userMessages: string[];
  botMessages: string[];
}
