"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const leopard_node_1 = require("@picovoice/leopard-node");
// @ts-ignore
const gtts_1 = __importDefault(require("gtts"));
require("dotenv/config");
const token = process.env.TELEGRAM_TOKEN;
const accessKey = process.env.ACCESS_KEY;
if (!token || !accessKey)
    throw new Error("ENV PARSING ERROR");
const handle = new leopard_node_1.Leopard(accessKey);
const bot = new node_telegram_bot_api_1.default(token);
const Description = "Hi! I'm @SachipegaBot for Text-To-Speech and Speech-To-Text!\n" +
    "If you want use Speech-To-Text just send me an a voice message(not file!)\n" +
    "If you want use Text-To-Speech send me any text message and get it Voiced!\n" +
    "IMPORTANT: only English language supported!";
class MessageHandler {
    StartCommand(receivedMessage) {
        bot.sendMessage(receivedMessage.chat.id, Description)
            .then().catch((err) => {
            throw new Error(err.toString());
        });
    }
    SpeechToText(receivedMessage) {
        var _a;
        const id = (_a = receivedMessage.voice) === null || _a === void 0 ? void 0 : _a.file_id;
        if (!id)
            throw new Error("fileId is undefined");
        bot.getFile(id).then(response => {
            (0, node_fetch_1.default)(`https://api.telegram.org/file/bot${token}/${response.file_path}`)
                .then(data => {
                const file = fs_1.default.createWriteStream("./files/file.ogg");
                if (!data.body)
                    throw new Error("File object body is null or undefined");
                data.body.pipe(file).on("close", () => {
                    const result = handle.processFile("./files/file.ogg");
                    bot.sendMessage(receivedMessage.chat.id, result.transcript)
                        .then().catch((err) => {
                        throw new Error(err.toString());
                    });
                });
            });
        });
    }
    TextToSpeech(receivedMessage) {
        if (receivedMessage.text !== "/start") {
            const gtts = new gtts_1.default(receivedMessage.text, 'en');
            //@ts-ignore
            gtts.save('./files/Voice.ogg', (err) => {
                if (err) {
                    throw new Error(err);
                }
                bot.sendVoice(receivedMessage.chat.id, "./files/Voice.ogg")
                    .then().catch((err) => {
                    throw new Error(err.toString());
                });
            });
        }
    }
}
exports.default = MessageHandler;
