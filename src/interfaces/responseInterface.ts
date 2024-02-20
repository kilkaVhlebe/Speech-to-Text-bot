import TelegramBot from "node-telegram-bot-api";
import internal from "node:stream";

export interface responseInterface {
    chatId: number,
    message: string | Buffer | internal.Stream
}