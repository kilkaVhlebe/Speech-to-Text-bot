import TelegramBot from "node-telegram-bot-api";
import fs from "fs"
import nodeFetch from "node-fetch"
import {Leopard} from "@picovoice/leopard-node";
// @ts-ignore
import GTTS from "gtts";
import {accessKey, token} from "./index";
import {Description, downloadPath, downloadURL, uploadPath} from "./constants";
import {MessageController} from "./Message.Controller";

console.log(token + " " + accessKey)
if(!token || !accessKey) throw new Error("ENV PARSING ERROR")

const handle = new Leopard(accessKey);
const bot = new TelegramBot(token);
const Controller = new MessageController()


export class MessageHandler {

    async StartCommand(receivedMessage: TelegramBot.Message) {
       await Controller.startCommand({chatId: receivedMessage.chat.id, message: Description})
    }

    async SpeechToText(receivedMessage: TelegramBot.Message) {
        const fileData = await bot.getFile(<string>receivedMessage.voice?.file_id)
        const file = await nodeFetch(downloadURL(fileData.file_path))
        const filePath = downloadPath
        file.body.pipe(fs.createWriteStream(filePath)).on("close", async () => {
            const result = handle.processFile(filePath)
            await Controller.speechToText({chatId: receivedMessage.chat.id, message: result.transcript})
        })
    }

    TextToSpeech(receivedMessage: TelegramBot.Message) {
        const gtts = new GTTS(receivedMessage.text, 'en');
        gtts.save(uploadPath, async (err: string) => {
            if (err) throw new Error(err)
            await Controller.textToSpeech({chatId: receivedMessage.chat.id, message: uploadPath})
        })
    }
}