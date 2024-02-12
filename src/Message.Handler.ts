import TelegramBot from "node-telegram-bot-api";
import fs from "fs"
import nodeFetch from "node-fetch"
import {Leopard} from "@picovoice/leopard-node";
// @ts-ignore
import gTTS from "gtts";
import "dotenv/config"


const token = process.env.TELEGRAM_TOKEN;
const accessKey = process.env.ACCESS_KEY;

if(!token || !accessKey) throw new Error("ENV PARSING ERROR")


const handle = new Leopard(accessKey);
const bot = new TelegramBot(token);

const Description = "Hi! I'm @SachipegaBot for Text-To-Speech and Speech-To-Text!\n" +
    "If you want use Speech-To-Text just send me an a voice message(not file!)\n" +
    "If you want use Text-To-Speech send me any text message and get it Voiced!\n" +
    "IMPORTANT: only English language supported!"

export default class MessageHandler {

    StartCommand(receivedMessage: TelegramBot.Message) {
        bot.sendMessage(receivedMessage.chat.id, Description)
            .then().catch((err) => {
                throw new Error(err.toString())
        })
    }

    SpeechToText(receivedMessage: TelegramBot.Message) {

        const id = receivedMessage.voice?.file_id

        if (!id) throw new Error("fileId is undefined")

        bot.getFile(id).then(response => {

            nodeFetch(`https://api.telegram.org/file/bot${token}/${response.file_path}`)
                .then(data => {

                    const file = fs.createWriteStream("./files/file.ogg");

                    if (!data.body) throw new Error("File object body is null or undefined")

                    data.body.pipe(file).on("close", () => {

                        const result = handle.processFile("./files/file.ogg");

                        bot.sendMessage(receivedMessage.chat.id, result.transcript)
                            .then().catch((err) => {
                            throw new Error(err.toString())
                        })
                    })
                })
        })

    }

    TextToSpeech(receivedMessage: TelegramBot.Message) {

        if(receivedMessage.text !== "/start") {

            const gtts = new gTTS(receivedMessage.text, 'en');
            //@ts-ignore
            gtts.save('./files/Voice.ogg', (err: string) => {
                if (err) {
                    throw new Error(err);
                }

                bot.sendVoice(receivedMessage.chat.id, "./files/Voice.ogg")
                    .then().catch((err) => {
                    throw new Error(err.toString())
                })

            })
        }
    }
}