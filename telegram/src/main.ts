require("dotenv").config()
import { Telegraf, Extra, session } from "telegraf"
import { ExtraReplyMessage } from "telegraf/typings/telegram-types"
import type { TelegrafContext } from "telegraf/typings/context"
import got from "got"

const bot = new Telegraf(process.env.BOT_TOKEN, {
  username: "raphtlw_clone_bot",
})

interface TelegrafSession {
  turns: Turn[]
}

interface TelegrafCtx extends TelegrafContext {
  session: TelegrafSession
}

bot.use(session())

bot.start((ctx: TelegrafCtx) => {
  ctx.session.turns = []
  console.log(`Bot started in ${ctx.chat.type} chat`)
  if (ctx.chat.type === "private") {
    ctx.reply(
      "Hey, what's up? If I am getting annoying, type /start to restart me."
    )
  } else if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    ctx.reply(
      "Hey, what's up? If I am getting annoying, type /start to restart me. To talk to me, add @raph to the start of your message."
    )
  }
})

async function chat(turns: Turn[], message: string) {
  console.log(`Turns: ${JSON.stringify(turns)}`)
  console.log(`User message: ${message}`)

  const botResponse = await (async () => {
    const res = await got.post<{ turns: Turn[]; bot_message: string }>(
      process.env.BRAIN_URL,
      {
        json: { turns: turns, user_message: message },
        responseType: "json",
      }
    )

    return { turns: res.body.turns, botMessage: res.body.bot_message }
  })()

  console.log(`Bot response: ${JSON.stringify(botResponse)}`)

  return botResponse
}

bot.on("text", async (ctx: TelegrafCtx) => {
  try {
    const turns = ctx.session.turns || []

    if (ctx.chat.type === "private") {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing")
      console.log(`Recieved: ${ctx.message.text} (private)`)
      const reply = await chat(turns, ctx.message.text)
      ctx.session.turns = reply.turns
      await ctx.reply(reply.botMessage)
      console.log(`Replied: ${reply.botMessage}`)
    } else if (ctx.message.text.startsWith("@raph ")) {
      ctx.telegram.sendChatAction(ctx.chat.id, "typing")
      console.log(`Recieved: ${ctx.message.text} (group - ${ctx.chat.title})`)
      const reply = await chat(turns, ctx.message.text.replace("@raph ", ""))
      ctx.session.turns = reply.turns
      await ctx.reply(
        reply.botMessage,
        Extra.inReplyTo(ctx.message.message_id) as ExtraReplyMessage
      )
      console.log(`Replied: ${reply.botMessage}`)
    } else {
      return
    }

    console.log(
      `Recieved ${ctx.message.text} from ${
        ctx.message.chat.title || "private chat"
      }`
    )
  } catch (e) {
    console.log(e)
  }
})

bot.telegram.setWebhook(process.env.WEBHOOK_URL)
bot.startWebhook("/webhook", null, 8443, "0.0.0.0")

interface Turn {
  user_messages: string[]
  bot_messages: string[]
}
