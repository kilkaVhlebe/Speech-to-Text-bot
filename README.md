# Telegram Bot for Speech to Text
## install
```
git clone https://github.com/tugaserya/Speech-to-Text-bot.git 

npm i
```
Create `.env` file and add this fields:
TELEGRAM_TOKEN="Your token"
ACCESS_KEY="Your access key from [https://console.picovoice.ai/](https://console.picovoice.ai/)
## Runing
Dev:
```
npm run dev
```
Prod
```
npm start
```
## Usege in Telegram
``
/start
``- Send you Welcom message.
``
SpeechToText
``- Send any voice message to bot(only voice not a Video note or file!) and get Text from message(Use [picovoice ai](https://picovoice.ai/))
``
TextToSpeech
``- Send any texted message to bot and get it voiced(use gtts module).

