import TelegramBot from "node-telegram-bot-api";
import MessageHandler from "./Message.Handler";
import "dotenv/config"

const token = process.env.TELEGRAM_TOKEN;
if(typeof token !== "string") throw new Error("TOKEN PARSING ERROR")
const bot = new TelegramBot(token, {polling: true});


const Handler = new MessageHandler()

bot.on("voice",(message) =>{

    Handler.SpeechToText(message)

})

