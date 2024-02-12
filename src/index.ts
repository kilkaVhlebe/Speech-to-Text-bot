import TelegramBot from "node-telegram-bot-api";
import MessageHandler from "./Message.Handler";
import "dotenv/config"

const token = process.env.TELEGRAM_TOKEN;
if(!token) throw new Error("token is undefined")


const bot = new TelegramBot(token, {polling: true});
const Handler = new MessageHandler()




bot.onText(/\/start/,(message) => {

    Handler.StartCommand(message)

})

bot.on("voice",(message) =>{

    Handler.SpeechToText(message)

})

bot.on("text", (message, metadata) => {

    if(!message.text){
        throw new Error("Message has an empty body")
    }
    Handler.TextToSpeech(message)

})

