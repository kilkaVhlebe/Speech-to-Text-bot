import TelegramBot from "node-telegram-bot-api";
import fs from "fs"
import nodeFetch from "node-fetch"
import {Leopard} from "@picovoice/leopard-node";
// @ts-ignore
import gTTS from "gtts";
// TODO: FIX THE IMPORT
import { OpusEncoder } from "@discordjs/opus"
import "dotenv/config"
import path from "node:path";

const token = process.env.TELEGRAM_TOKEN;
const accessKey = process.env.ACCESS_KEY;

if(!token || !accessKey) throw new Error("ENV PARSING ERROR")

const encoder = new OpusEncoder(48000, 2);
const handle = new Leopard(accessKey);
const bot = new TelegramBot(token);

export default class MessageHandler {
    SpeechToText(receivedMessage: TelegramBot.Message) {
        const id = receivedMessage.voice?.file_id
        if (!id) throw new Error("fileId is undefined")

        bot.getFile(id).then(response => {
            nodeFetch(`https://api.telegram.org/file/bot${token}/${response.file_path}`)
                .then(data => {

                    const file = fs.createWriteStream(`./files/file.ogg`);

                    if (!data.body) throw new Error("Stream body is null")

                    data.body.pipe(file).on("close", () => {

                        const result = handle.processFile("./files/file.ogg");
                        bot.sendMessage(receivedMessage.chat.id, result.transcript)
                    })
                })
        })

    }

    TextToSpeech(receivedMessage: TelegramBot.Message, metadata: TelegramBot.Metadata) {

        const gtts = new gTTS(receivedMessage.text, 'en');
        // @ts-ignore
        gtts.save('./files/Voice.ogg', (err: string, result) => {
            if (err) {
                throw new Error(err);
            }


            fs.readFile(path.join(__dirname, "../files/Voice.ogg"), (err, data) => {
                if (err) throw new Error()
                const encoded = encoder.encode(data);
                bot.sendVoice(receivedMessage.chat.id, encoded);
            })

        })

    }
}