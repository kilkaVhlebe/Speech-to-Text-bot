"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const leopard_node_1 = require("@picovoice/leopard-node");
require("dotenv/config");
const token = process.env.TELEGRAM_TOKEN;
const accessKey = process.env.ACCESS_KEY;
if (!token || !accessKey)
    throw new Error("ENV PARSING ERROR");
const handle = new leopard_node_1.Leopard(accessKey);
const bot = new node_telegram_bot_api_1.default(token);
class MessageHandler {
    SpeechToText(receivedMessage) {
        var _a;
        const id = (_a = receivedMessage.voice) === null || _a === void 0 ? void 0 : _a.file_id;
        if (!id)
            throw new Error("fileId is undefined");
        bot.getFile(id).then(response => {
            (0, node_fetch_1.default)(`https://api.telegram.org/file/bot${token}/${response.file_path}`)
                .then(data => {
                const file = fs_1.default.createWriteStream(`./files/file.ogg`);
                if (!data.body)
                    throw new Error("Stream body is null");
                data.body.pipe(file).on("close", () => {
                    const result = handle.processFile("./files/file.ogg");
                    bot.sendMessage(receivedMessage.chat.id, result.transcript);
                });
            });
        });
    }
}
exports.default = MessageHandler;
