const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = process.env.GROUP_ID;
const MUROJAAT_BOT_ID = process.env.MUROJAAT_BOT_ID;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

bot.on('message', async (msg) => {
  if (String(msg.chat.id) === String(GROUP_ID) &&
      String(msg.from.id) === String(MUROJAAT_BOT_ID)) {
    
    const text = msg.text || 'Yangi murojaat!';
    
    await admin.messaging().send({
      topic: 'all_workers',
      notification: {
        title: '📩 Yangi murojaat!',
        body: text.substring(0, 100),
      },
    });
  }
});

app.get('/', (req, res) => res.send('Bot ishlayapti!'));

app.listen(3000, () => console.log('Server started'));
