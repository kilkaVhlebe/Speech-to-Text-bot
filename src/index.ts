import TelegramBot from "node-telegram-bot-api";
import { MessageHandler } from "./Message.Handler";
import { MessageController } from "./Message.Controller";
import "dotenv/config"

export const token = process.env.TELEGRAM_TOKEN;
export const accessKey = process.env.ACCESS_KEY

if(!token || !accessKey) throw new Error("ENV PARSING ERROR")


export const bot = new TelegramBot(token, {polling: true});

const Handler = new MessageHandler()
const Controller = new MessageController()


bot.onText(/\/start/,(message) => {
    Handler.StartCommand(message)
})

bot.on("voice",(message) =>{
    Handler.SpeechToText(message)
})

bot.on("text", (message, metadata) => {
    if(!message.text) throw new Error("Message has an empty body")
    if(message.text !== "/start") Handler.TextToSpeech(message)
})

