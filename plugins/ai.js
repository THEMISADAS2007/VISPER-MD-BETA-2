import config from '../config.js';
import os from 'os';
import axios from 'axios';
import mimeTypes from 'mime-types';
import fs from 'fs';
import path from 'path';
import pkg from '@whiskeysockets/baileys';
const { 
    generateForwardMessageContent, 
    prepareWAMessageFromContent, 
    generateWAMessageContent, 
    generateWAMessageFromContent 
} = pkg;

import { cmd, commands } from '../command.js';
import { 
    getBuffer, 
    getGroupAdmins, 
    getRandom, 
    h2k, 
    isUrl, 
    Json, 
    runtime, 
    sleep, 
    fetchJson 
} from '../lib/functions.js';

const GEMINI_API_KEY = "AIzaSyB8xtFPtvG_N9S7bBZZOSfTyZW8rQyJQkY";
import { URL } from 'url';


cmd({
    pattern: "gemini",
    react: "👾",
    alias: ["geminiai", "geminichat", "ai2"],
    desc: "Use Gemini AI to get a response",
    category: "ai",
    use: "gemini < query >",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix }) => {
    const userMessage = args.join(" ");
    if (!userMessage) return await reply(noInputMsg, `\`${prefix}gemini your question\``);

    try {
        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userMessage }] }]
            }
        );

        const aiResponse = res.data.candidates[0].content.parts[0].text.trim();
        await reply(`${aiResponse}`);
    } catch (error) {
        console.error("Google Gemini API Error:", error.response?.data || error.message);
        await reply("❌ *Error connecting to Gemini AI. Please try again later.*");
    }
});


cmd({
 pattern: "imagen",
  alias: ["imggen", "dalle"],
  react: "🎨",
  desc: "Generate an AI image",
  category: "ai",
  filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
  try {
    if (!q) return reply("❗ Please provide a prompt.\nExample: `.image A futuristic city`");

    // Free image generation API (pollinations.ai)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(q)}`;

    await conn.sendMessage(from, { image: { url: imageUrl }, caption: `🖼️ AI Generated Image\nPrompt: ${q}\n\n ${config.FOOTER}` }, { quoted: mek });
  } catch (err) {
    reply("⚠️ Image generation failed.");
    console.error(err);
  }
});

    cmd({
        pattern: "blackbox",
    react: "👾",
    alias: ["bbox", "bb", "ai"],
    desc: "Use BlackBox AI to get a response",
    category: "ai",
    use: "blackbox < query >",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return await reply(queryMsg, '🧠');
        }

        const scraperData = await blackbox(q);
        const apiData = await fetchJson("https://api.siputzx.my.id/api/ai/blackboxai-pro?content=" + q);
        const result = scraperData ? scraperData : apiData?.data;
        await reply(result, `🧠`);

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await reply(errorMsg);
    }
});

cmd({
    pattern: "girlai",
    react: '💕',
    category: "ai",
    alias: ["girlchat", "aiwaifu"],
    desc: "Chat with Girl AI using Gemini-powered bot",
    use: ".girlai <your message>",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner, reply }) => {
    try {
        // 🧩 Premium check (reuse from existing logic if needed, assuming same checks apply)
        const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;
        const isFree = pr.mvfree === "true";

        if (!isFree && !isMe && !isPre) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, {
                text: "*`You are not a premium user⚠️`*\n\n" +
                      "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
                      "_Price : 200 LKR ✔️_\n\n" +
                      "*👨‍💻Contact us : 0778500326 , 0722617699*"
            }, { quoted: mek });
        }

        if (config.AI_BLOCK == "true" && !isMe && !isSudo && !isOwner) {  // Assuming a config.AI_BLOCK similar to MV_BLOCK
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { 
                text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" 
            }, { quoted: mek });
        }

        if (!q) return await reply('*Please enter a message to chat with Girl AI! 💭* (e.g., .girlai Hello, how are you?)');

        // 🔗 Prepare API URL with encoded text
        const apiUrl = `https://apis.sandarux.sbs/api/ai/girlai?text=${encodeURIComponent(q)}&geminiapikey=AIzaSyB2AWEV_ZqXnU-Rw6pgW1P7IPnBMyZ9LIk`;

        // 🧠 Fetch response from Girl AI API
        const { data: aiRes } = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000 // 15s timeout
        });

        // 🧠 Normalize response (Updated to prioritize 'reply' field based on API structure)
        let aiResponse = '';
        if (aiRes && aiRes.reply) {
            aiResponse = aiRes.reply;
        } else if (aiRes && aiRes.status && aiRes.reply) {  // Fallback for status-checked structure
            aiResponse = aiRes.reply;
        } else if (aiRes && typeof aiRes === 'string') {
            aiResponse = aiRes;
        } else if (aiRes && aiRes.text) {
            aiResponse = aiRes.text;
        } else {
            aiResponse = 'Sorry, I couldn\'t get a response from Girl AI right now. 😔';
        }

        // 📝 Send response with flair
        const msg = `*💕 Girl AI:* _${aiResponse}_\n\n*🤖 Powered by Gemini*\n\n*💭 Your message:* ${q}`;
        
        await conn.sendMessage(from, { 
            text: msg,
            footer: config.FOOTER || "Girl AI Chat 💕"
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '💕', key: mek.key } });

    } catch (e) {
        console.error("🔥 Girl AI Error:", e);
        reply('🚫 *Error Occurred !!*\n\n' + e.message + '\n\nTry again later! 💔');
    }
});


cmd({
    pattern: "claudeai",
    react: '🤖',
    category: "ai",
    alias: ["cloudai", "claudechat"],
    desc: "Chat with Claude AI powered bot",
    use: ".claudeai <your message>",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner, reply }) => {
    try {
        // 🧩 Premium check (reuse from existing logic if needed, assuming same checks apply)
        const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;
        const isFree = pr.mvfree === "true";

        if (!isFree && !isMe && !isPre) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, {
                text: "*`You are not a premium user⚠️`*\n\n" +
                      "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
                      "_Price : 200 LKR ✔️_\n\n" +
                      "*👨‍💻Contact us : 0778500326 , 0722617699*"
            }, { quoted: mek });
        }

        if (config.AI_BLOCK == "true" && !isMe && !isSudo && !isOwner) {  // Assuming a config.AI_BLOCK similar to MV_BLOCK
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { 
                text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" 
            }, { quoted: mek });
        }

        if (!q) return await reply('*Please enter a message to chat with Claude AI! 💭* (e.g., .claudeai Hello, how are you?)');

        // 🔗 Prepare API URL with encoded text (no API key needed based on example)
        const apiUrl = `https://apis.sandarux.sbs/api/ai/claude?text=${encodeURIComponent(q)}`;

        // 🧠 Fetch response from Claude AI API
        const { data: aiRes } = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000 // 15s timeout
        });

        // 🧠 Normalize response (API returns { status, text, response })
        let aiResponse = '';
        if (aiRes && aiRes.status === true && aiRes.response) {
            aiResponse = aiRes.response;
        } else if (aiRes && typeof aiRes === 'string') {
            aiResponse = aiRes;
        } else if (aiRes && aiRes.text) {
            aiResponse = aiRes.text;
        } else {
            aiResponse = 'Sorry, I couldn\'t get a response from Claude AI right now. 😔';
        }

        // 📝 Send response with flair
        const msg = `*🤖 Claude AI:* _${aiResponse}_\n\n*💭 Your message:* ${q}`;
        
        await conn.sendMessage(from, { 
            text: msg,
            footer: config.FOOTER || "Claude AI Chat 🤖"
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '🤖', key: mek.key } });

    } catch (e) {
        console.error("🔥 Claude AI Error:", e);
        reply('🚫 *Error Occurred !!*\n\n' + e.message + '\n\nTry again later! 😔');
    }
});



