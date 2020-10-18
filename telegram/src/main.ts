require("dotenv").config();
import { Telegraf, Extra, session } from "telegraf";
import got from "got";
import { TelegrafContext } from "telegraf/typings/context";

const bot = new Telegraf(process.env.BOT_TOKEN, {
  username: "raphtlw_clone_bot",
});
// const EOS_TOKEN = "<|endoftext|>";
// let maxTurnsHistory = 2;
// let turns: Turn[] = [];

bot.use(session());

bot.start((ctx) => {
  // @ts-ignore
  ctx.session.turns = [];
  console.log(`Bot started in ${ctx.chat.type} chat`);
  if (ctx.chat.type === "private") {
    ctx.reply(
      "Hey, what's up? If I am getting annoying, type /start to restart me."
    );
  } else if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    ctx.reply(
      `Hey, what's up? If I am getting annoying, type /start to restart me.
      To talk to me, type @raph at the start of your message.`
    );
  }
});

async function chat(turns: Turn[], message: string) {
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

  console.log(`Turns: ${JSON.stringify(turns)}`);
  console.log(`User message: ${message}`);

  const botResponse = await (async () => {
    const res = await got.post<{ turns: Turn[]; bot_message: string }>(
      process.env.BRAIN_URL,
      {
        json: { turns: turns, user_message: message },
        responseType: "json",
      }
    );

    return { turns: res.body.turns, botMessage: res.body.bot_message };
  })();

  console.log(`Bot response: ${JSON.stringify(botResponse)}`);

  return botResponse;
}

bot.on("text", async (ctx) => {
  try {
    // @ts-ignore
    const turns = ctx.session.turns || [];

    if (ctx.chat.type === "private") {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing");
      console.log(`Recieved: ${ctx.message.text} (private)`);
      const reply = await chat(turns, ctx.message.text);
      // @ts-ignore
      ctx.session.turns = reply.turns;
      await ctx.reply(reply.botMessage);
    } else if (
      (ctx.chat.type === "group" || ctx.chat.type === "supergroup") &&
      ctx.message.text.startsWith("@raph ")
    ) {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing");
      console.log(`Recieved: ${ctx.message.text} (group - ${ctx.chat.title})`);
      const reply = await chat(turns, ctx.message.text.replace("@raph ", ""));
      // @ts-ignore
      ctx.session.turns = reply.turns;
      await ctx.reply(reply.botMessage);
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
