import {responseInterface} from "./interfaces/responseInterface";
import {bot} from "./index";

export class MessageController {

    async startCommand(data: responseInterface) {
        if (typeof data.message !== "string") throw new Error(`Expected string but have ${typeof data.message}`)
        await bot.sendMessage(data.chatId, data.message)
    }

    async speechToText(data: responseInterface) {
        if (typeof data.message !== "string") throw new Error(`Expected string but have ${typeof data.message}`)
        await bot.sendMessage(data.chatId, data.message)
    }

    async textToSpeech(data: responseInterface) {
        await bot.sendVoice(data.chatId, data.message)
    }

}