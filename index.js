// @ts-nocheck
require('dotenv').config();

const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

if (!config.channelAccessToken || !config.channelSecret) {
  console.error('❌ ไม่พบค่าใน .env');
  process.exit(1);
}

const client = new Client(config);

app.post('/webhook', middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).end();
    });
});

// สร้าง bubble สำหรับแต่ละเมนู — แก้ไขช่องว่างใน URL
function createStickerBubble() {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: 'https://food.mthai.com/app/uploads/2017/11/Hainanese-chicken-rice.jpg',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover'
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'ข้าวมันไก่ทอด', weight: 'bold', size: 'xl' },
        { type: 'text', text: 'ข้าวมันไก่ทอด น้ำจิ้มรสเด็ด', margin: 'md', wrap: true }
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: {
            type: 'uri',
            label: 'ดูร้าน',
            uri: 'https://food.mthai.com/food-recipe/126578.html'
          }
        }
      ]
    }
  };
}

function createThemeBubble() {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: 'https://cheewajit.com/app/uploads/2021/04/%E0%B8%81%E0%B9%8B%E0%B8%A7%E0%B8%A2%E0%B9%80%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%A2%E0%B8%A7%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD.jpg',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover'
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'ก๋วยเตี๋ยวเรือ', weight: 'bold', size: 'xl' },
        { type: 'text', text: 'ก๋วยเตี๋ยวเรือเข้มข้นแทบไม่ต้องปรุง', margin: 'md', wrap: true }
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: {
            type: 'uri',
            label: 'ดูร้าน',
            uri: 'https://cheewajit.com/healthy-food/recipe/225686.html'
          }
        }
      ]
    }
  };
}

function createEmojiBubble() {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: 'https://4kwallpapers.com/images/walls/thumbs_3t/23088.jpg',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover'
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: '"Wonyoung"', weight: 'bold', size: 'xl' },
        { type: 'text', text: 'Wonyoung 4kwallpapers 4K', margin: 'md', wrap: true }
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: {
            type: 'uri',
            label: 'โหลด 4kwallpapers',
            uri: 'https://4kwallpapers.com/music/jang-wonyoung-23088.html'
          }
        }
      ]
    }
  };
}

function createMenuCarousel() {
  return {
    type: 'flex',
    altText: 'เมนูหลัก - เลื่อนดูได้',
    contents: {
      type: 'carousel',
      contents: [
        createStickerBubble(),
        createThemeBubble(),
        createEmojiBubble()
      ]
    }
  };
}

// ✅ แก้ไข handleEvent ให้ทำงานครบ
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text.trim().toLowerCase();
  let replyText = ''; // 👈 ประกาศตรงนี้

  if (userMessage.includes('รายการทั้งหมด')) {
    const carouselMessage = createMenuCarousel();
    return client.replyMessage(event.replyToken, carouselMessage);
  } else if (userMessage.includes('ชื่อ') || userMessage.includes('name')) {
    replyText = 'ฉันชื่อ "ซิลเวีย" ค่ะ!';
  } else if (userMessage.includes('สวัสดี') || userMessage.includes('hi')) {
    replyText = 'สวัสดีค่ะ';
  } else if (userMessage.includes('อุปกรณ์อิเล็กทรอนิกส์') || userMessage.includes('Electronic Device')) {
    replyText = 'Computer';
  } else if (userMessage.includes('น้ำผลไม้') || userMessage.includes('Juice')) {
    replyText = 'น้ำส้ม';
  } else if (userMessage.includes('จงตื่น') || userMessage.includes('Arise')) {
    replyText = 'Arise';
  } else if (userMessage.includes('โปรโมชันของฉัน') || userMessage.includes('My promotion')) {
    replyText = 'You get 40% off';
  } else if (userMessage === 'เวลา') {
    const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    replyText = `ตอนนี้เวลาในประเทศไทยคือ: ${now}`;
  } else if (userMessage.includes('ข้าวมันไก่') || userMessage.includes('ข้าวมันไก่ทอด')) {
    return client.replyMessage(event.replyToken, { type: 'flex', altText: 'ข้าวมันไก่ทอด', contents: createStickerBubble() });
  } else if (userMessage.includes('ก๋วยเตี๋ยวเรือ')) {
    return client.replyMessage(event.replyToken, { type: 'flex', altText: 'ก๋วยเตี๋ยวเรือ', contents: createThemeBubble() });
  } else if (userMessage.includes('wonyoung') || userMessage.includes('วอนยอง') || userMessage.includes('รูป')) {
    return client.replyMessage(event.replyToken, { type: 'flex', altText: 'Wonyoung Wallpaper', contents: createEmojiBubble() });
  } else if (userMessage.includes('ช่วยเหลือ') || userMessage.includes('help')) {
    replyText = 'มีอะไรให้ฉันช่วยคะ';
  } else if (userMessage.includes('ทำอะไรได้') || userMessage.includes('ช่วยอะไรได้')) {
    replyText = 'ฉันช่วยตอบคำถามพื้นฐานได้ เช่น บอกเวลา แนะนำรายการทั้งหมด ช่วยคิดเลขง่ายๆ หรือคำนวนค่า bmi ได้ค่ะ';
  } else if (/^[\d+\-*/().\s]+$/.test(userMessage)) {
    const expr = userMessage.replace(/\s+/g, '');
    if (expr && /^[0-9+\-*/().]+$/.test(expr)) {
      try {
        const result = Function('"use strict"; return (' + expr + ')')();
        replyText = `คำตอบคือ: ${result}`;
      } catch (e) {
        replyText = 'ขอโทษค่ะ ไม่สามารถคำนวณสูตรนี้ได้';
      }
    } else {
      replyText = 'กรุณาใส่สูตรคำนวณที่ถูกต้อง เช่น 2+2 หรือ 10*5 ค่ะ';
    }
  } else if (userMessage.startsWith('bmi ')) {
    const numbers = userMessage.split(' ').slice(1).filter(x => !isNaN(x) && x.trim() !== '');
    if (numbers.length >= 2) {
        const weight = parseFloat(numbers[0]); // น้ำหนัก (กก.)
        let height = parseFloat(numbers[1]);   // ส่วนสูง (ซม. หรือ ม.)

        // ถ้าส่วนสูงมากกว่า 3 → ถือว่าเป็น cm → แปลงเป็นเมตร
        if (height > 3) {
        height = height / 100;
        }

        if (weight > 0 && height > 0 && height <= 3) {
        const bmi = weight / (height * height);
        const roundedBmi = Math.round(bmi * 100) / 100;

        let category = '';
        if (bmi < 18.5) category = 'น้ำหนักน้อย / ผอม';
        else if (bmi < 23) category = 'ปกติ (สุขภาพดี)';
        else if (bmi < 25) category = 'ท้วม / โรคอ้วนระดับ 1';
        else if (bmi < 30) category = 'อ้วน / โรคอ้วนระดับ 2';
        else category = 'อ้วนมาก / โรคอ้วนระดับ 3';

        replyText = `ค่า BMI ของคุณคือ ${roundedBmi}\nอยู่ในเกณฑ์: ${category}`;
        } else {
        replyText = 'กรุณาใส่น้ำหนักและส่วนสูงที่ถูกต้อง เช่น:\n"bmi 60 170"';
        }
    } else {
        replyText = 'รูปแบบการใช้งาน: "bmi [น้ำหนัก กก.] [ส่วนสูง ซม.]" เช่น:\n"bmi 60 170"';
    }
    } else {
    // กรณีไม่รู้จะตอบอะไร
    replyText = `คุณพูดว่า: "${event.message.text}"\nลองพิมพ์ "รายการทั้งหมด" ดูสิครับ 😊`;
  }

  // 👇 ส่งข้อความตอบกลับทุกกรณี (เว้นแต่ carousel ที่ return ไปแล้ว)
  return client.replyMessage(event.replyToken, { type: 'text', text: replyText });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bot start on port ${PORT}`);
});