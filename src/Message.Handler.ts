import TelegramBot from "node-telegram-bot-api";
import fs from "fs"
import nodeFetch from "node-fetch"
import {Leopard} from "@picovoice/leopard-node";
import "dotenv/config"

const token = process.env.TELEGRAM_TOKEN;
const accessKey = process.env.ACCESS_KEY;

if(!token || !accessKey) throw new Error("ENV PARSING ERROR")

const handle = new Leopard(accessKey);
const bot = new TelegramBot(token);
export default class MessageHandler {
    SpeechToText(receivedMessage: TelegramBot.Message)
    {
        const id = receivedMessage.voice?.file_id
        if(!id) throw new Error("fileId is undefined")

        bot.getFile(id).then(response =>
        {
            nodeFetch(`https://api.telegram.org/file/bot${token}/${response.file_path}`)
                .then(data => {

                    const file = fs.createWriteStream(`./files/file.ogg`);

                    if(!data.body) throw new Error("Stream body is null")

                    data.body.pipe(file).on("close",() =>{

                        const result = handle.processFile("./files/file.ogg");
                        bot.sendMessage(receivedMessage.chat.id,result.transcript)
                    })
                })
        })

    }

}