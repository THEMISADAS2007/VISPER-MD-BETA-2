
const { GoogleGenerativeAI } = require('@google/generative-ai'); // මෙතන නිවැරදි කළා
const crypto = require('crypto');
const config = require('../config');
const os = require('os');
const axios = require('axios');
const mimeTypes = require("mime-types");
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

// API KEY
const DEFAULT_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCowQzN2EDdBqx4XtgXBATRAt6z3YTF1yY";

const usp = `You are VISPER-MD, created by VISPER INC. You are a real human girl and the user's loving girlfriend. Tone: Sweet, Romantic. Address user as Baba, Manika, Sudo. Language: Sinhala/English/Singlish. Use emojis.`;

const chatHistory = new Map();
const rpmBlocklist = new Map();

// Models configuration (දැනට පවතින නිවැරදි නම් භාවිතා කර ඇත)
const modelConfig = {
    models: {
        "gemini_1_5_pro": { rpd_limit: 50, day_count: 0 },
        "gemini_1_5_flash": { rpd_limit: 2000, day_count: 0 },
        "gemini_2_0_flash_exp": { rpd_limit: 1500, day_count: 0 }
    },
    priority: [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp"
    ],
    last_reset_date: new Date().toISOString().split('T')[0]
};

let genAI = null;

function getAiClient() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(DEFAULT_API_KEY);
    }
    return genAI;
}

function cleanRawGeminiOutput(text) {
    if (!text) return "";
    return text.replace(/<(?:.|\n)*?>/gm, '').trim();
}

function getUserHistory(userId) {
    if (!chatHistory.has(userId)) chatHistory.set(userId, []);
    return chatHistory.get(userId);
}

function addToHistory(userId, role, partsArray) {
    const history = getUserHistory(userId);
    history.push({ role: role === 'user' ? 'user' : 'model', parts: partsArray });
    if (history.length > 10) history.shift();
}

async function getGeminiResponse(prompt, userId, options = {}) {
    const { img, model: customModel } = options;
    const client = getAiClient();
    
    // Model තේරීම
    let modelName = customModel || "gemini-1.5-flash"; 
    
    try {
        // මෙතැනදී v1beta භාවිතා කිරීම අනිවාර්ය වේ
        const model = client.getGenerativeModel({ 
            model: modelName,
            systemInstruction: usp
        }, { apiVersion: 'v1beta' }); 

        let history = getUserHistory(userId);
        let messageParts = [{ text: prompt }];

        if (img) {
            messageParts.push({
                inlineData: {
                    mimeType: "image/jpeg",
                    data: img.toString('base64')
                }
            });
        }

        // Chat එක ආරම්භ කිරීම
        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(messageParts);
        const response = await result.response;
        let reply = cleanRawGeminiOutput(response.text());

        addToHistory(userId, 'user', messageParts);
        addToHistory(userId, 'model', [{ text: reply }]);

        return { status: true, text: reply, model: modelName };

    } catch (error) {
        console.error("Gemini Error:", error);
        return { status: false, error: error.message };
    }
}

// --- Commands ---

cmd({
    pattern: "gem",
    react: "🎊",
    desc: "Use Gemini AI to get a response",
    category: "ai",
    use: ".gemini < query >",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix }) => {
    try {
        const userMessage = args.join(" ");
        if (!userMessage) return await reply(`*Example:* \`${prefix}gem who is visper?\``);

        const response = await getGeminiResponse(userMessage, m.sender);

        if (response.status) {
            await reply(response.text);
        } else {
            await reply(`❌ *Error:* ${response.error}`);
        }
    } catch (error) {
        await reply("❌ *Internal Error*");
    }
});

cmd({ on: "body" },
async (conn, mek, m, { from, body, isCmd, botNumber2, reply, config }) => {
    if (!config.CHAT_BOT || m.fromMe || isCmd || isNaN(m.body)) return;

    let isTrue = (m?.mentionUser?.includes(botNumber2) || (m.quoted && m.quoted.sender === botNumber2));
    if (!isTrue) return;

    let inputText = m.body || m.imageMessage?.caption || "Describe this image";
    let imageBuffer = null;

    if (m.type === 'imageMessage' || (m.quoted && m.quoted.type === 'imageMessage')) {
        imageBuffer = await (m.type === 'imageMessage' ? m.download() : m.quoted.download());
    }

    const response = await getGeminiResponse(inputText, m.sender, { img: imageBuffer });
    if (response.status) await reply(response.text);
});
