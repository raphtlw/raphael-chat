require("dotenv").config();
import { Telegraf, Extra } from "telegraf";
import got from "got";

const bot = new Telegraf(process.env.BOT_TOKEN);
