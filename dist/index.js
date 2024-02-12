"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const Message_Handler_1 = __importDefault(require("./Message.Handler"));
require("dotenv/config");
const token = process.env.TELEGRAM_TOKEN;
if (!token)
    throw new Error("token is undefined");
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
const Handler = new Message_Handler_1.default();
bot.onText(/\/start/, (message) => {
    Handler.StartCommand(message);
});
bot.on("voice", (message) => {
    Handler.SpeechToText(message);
});
bot.on("text", (message, metadata) => {
    if (!message.text) {
        throw new Error("Message has an empty body");
    }
    Handler.TextToSpeech(message);
});
