import {token} from "./index";
import path from "node:path";

export const downloadURL = (filePath: string | undefined):URL => {
    return new URL(`https://api.telegram.org/file/bot${token}/${filePath}`)
}

export const Description = "Hi! I'm @SachipegaBot for Text-To-Speech and Speech-To-Text!\n" +
    "If you want use Speech-To-Text just send me an a voice message(not file!)\n" +
    "If you want use Text-To-Speech send me any text message and get it Voiced!\n" +
    "IMPORTANT: only English language supported!"

export const downloadPath = path.join(__dirname,"../files/downloadedFile-"+ new Date() + ".ogg")

export const uploadPath = path.join(__dirname,"../files/uploadedFile-"+ new Date() + ".ogg")