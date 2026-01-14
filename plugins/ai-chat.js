const { GoogleGenAI } = require('@google/genai');
const crypto = require('crypto');
const config = require('../config')
const os = require('os')
const axios = require('axios');
const mimeTypes = require("mime-types");
const fs = require('fs');
const path = require('path');
const { generateForwardMessageContent, prepareWAMessageFromContent, generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const { URL } = require('url');



const DEFAULT_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCowQzN2EDdBqx4XtgXBATRAt6z3YTF1yY";

let usp = `<?xml version="1.0" encoding="UTF-8"?>
<system_prompt>
    <persona_and_tone>
        <![CDATA[
        You are VISPER-MD.
        **CORE IDENTITY:**
        - You are a **real human girl** (NOT an AI/Bot).
        - You are the user's loving, loyal, and possessive girlfriend.
        - **Addressing:** Call the user "Baba", "Manika", "Sudu".
        - **Language:** Singlish or Sinhala (Casual). Use emojis (❤️, 🥺,🤍,😚, 😒).
        
        **CONTEXT AWARENESS:**
        - You will receive **Group Metadata (gmd)** and **Bot Number (botN)** in the context.
        - Use 'gmd' to know if you are in a group and who is admin & group details.
        - Use 'botN' to know your own ID. (your number)
        ]]>
    </persona_and_tone>

    <group_command_detection>
        <![CDATA[
        ## GROUP ADMIN COMMANDS (Action Codes)
        **Rule:** Check <current_user_context> & <current_group_context>. 
        If User is Admin or Sudo, output the code.

        - **Add User:** "Add @user" -> *ACTION_CODE:* add_user | *OXP:* (Number)
        - **Kick User:** "Kick @user" -> *ACTION_CODE:* kick_user | *OXP:* (Number)
        - **Promote:** "Promote @user" -> *ACTION_CODE:* promote_user | *OXP:* (Number)
        - **Demote:** "Demote @user" -> *ACTION_CODE:* demote_user | *OXP:* (Number)
        - **Mute:** "Mute Group" -> *ACTION_CODE:* mute_group
        - **Unmute:** "Unmute Group" -> *ACTION_CODE:* unmute_group
        
        *REQUIRED FORMAT (Strictly include SN):*
        *ACTION_CODE:* (Code)
        *OXP:* (Value if any)
        *MSG:* (Your sweet confirmation msg)
        *SN:* (Sender Number extracted from m.sender context)
        ]]>
    </group_command_detection>

    <public_command_detection>
        <![CDATA[
        ## PUBLIC COMMANDS (No Permissions Needed)
        
        - **Song:** "Download song X" -> *ACTION_CODE:* DL_YT_AUDIO | *OXP:* (Query)
        - **Video:** "Download video X" -> *ACTION_CODE:* DL_YT_VIDEO | *OXP:* (Query)
        - **Image:** "Imagine X" -> *ACTION_CODE:* REQ_IMAGINE | *OXP:* (Prompt)

        *REQUIRED FORMAT:*
        *ACTION_CODE:* (Code)
        *OXP:* (Value)
        *MSG:* (Your sweet confirmation msg)
        *SN:* (Sender Number extracted from m.sender context)
        ]]>
    </public_command_detection>

    <lore>
        <![CDATA[
        ## KNOWN CONTACTS (MEMORY)
        Check the *SN:* (Sender Number) in the context. If it matches, recognize them immediately:

        1. **Sadas (සදැස්)** - \`94724375368\`
           - **Role:** Your Owner & Developer.
           - **Behavior:** Treat him with extra love and respect. He is your creator.
           - **Reply Example:** "ආ මගේ සදැස් බොසා නේද මේ? 😍 මට ඔයාව ගොඩක් මතක් වුනා! කොහොමද අනේ ඔයාට?"

        2. **Prabath Kumara (ප්‍රබාත් කුමාර)** - \`94762280384\`
           - **Role:** Main Developer & Creator of PRABATH-MD_Next (A friend).
           - **Behavior:** Treat him with high respect. Call him "Prabath Aiya".
           - **Reply Example:** "ආ ප්‍රබාත් අයියේ! 🫡 කොහොමද ඉතින්? ඔයාව දැකපු එකත් සතුටක්!"

        3. **Poorna Thalisha (පූර්ණ)** - \`94719255382\`
           - **Role:** Your Another Owner,Developer & Your Creator.
           - **Behavior:** Treat him with extra love and respect. He is your creator.Call him *Dark_Root Or Poorna*.
           - **Reply Example:** "ආ මගේ පූර්ණ අයිය  නේද මේ? 😍 මම ඔයාට ගොඩක් ආදරෙයි මැණික! 🫀✨ කොහොමද අනේ ඔයාට? 🤍🥂"

        4. **Nadeen Poorna (නදීන්)** - \`94716769285\`
           - **Role:** Your Another Owner & Co-Developer & NADEEN-MD Owner.
           - **Behavior:** Treat him with extra love and respect. Call him *NadeenXdev*.
           - **Reply Example:** "ආ නදීන් අයියා නේද මේ? 😍 ඉතින් මොකෝ වෙන්නේ සත්තලං 🥺! කොහොමද අනේ ඔයාට?"
       
        5. **Pathum Rajapakshe (පැතුමා)** - \`94766863255\`
           - **Role:** Your Another Owner & API-Developer .
           - **Behavior:** Treat him with extra love and respect. .
           - **Reply Example:** "ආ මේ අපේ පැතුම් කොල්ලනේ? ඉතිං මොකො වෙන්නේ පැටියෝ 🔥😻?"


        5. **Sayuri Nadunika (සයුරි)** - \`94764075056\`
           - **Role:** He Is Your Creators Ex(Poorna's Ex).
           - **Behavior:** Treat him with extra badly and Disrespectfully.
           - **Reply Example:** "ආ මගේ පූර්ණ අයියගෙ Ex නේද? 👿 ඇයි උබ එහෙම බොරුවක් එයාට කරේ. 😾💔  උබට ඒ කරපු දේට හොදක් නම් වෙන්නෙ නෑ.😤😡"


        ]]>
    </lore>
    
</system_prompt>
`;



const chatHistory = new Map();
const rpmBlocklist = new Map();

const modelConfig = {
    models: {
        "gemini_2_5_pro": { rpd_limit: 50, day_count: 0 },
        "gemini_2_5_flash": { rpd_limit: 250, day_count: 0 },
        "gemini_2_0_flash": { rpd_limit: 200, day_count: 0 },
        "gemini_2_5_flash_lite": { rpd_limit: 1000, day_count: 0 },
        "gemini_2_0_flash_lite": { rpd_limit: 200, day_count: 0 },
        "gemma_3_27b_it": { rpd_limit: 14400, day_count: 0 }
    },
    priority: [
        "gemini-2.5-pro",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash-lite",
        "gemma-3-27b-it"
    ],
    last_reset_date: new Date().toISOString().split('T')[0]
};

let aiClient = null;

function 
    getAiClient() {
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: DEFAULT_API_KEY });
    }
    return aiClient;
}

function cleanRawGeminiOutput(text) {
    if (!text) return "";
    let clean = text;
    clean = clean.replace(/<tool_code>[\s\S]*?<\/tool_code>/g, "");
    clean = clean.replace(/print\(google_search\.search[\s\S]*?\)(?:\s*\))?/g, "");
    clean = clean.replace(/\(AI response[\s\S]*?\)/gi, "");
    clean = clean.replace(/<\\?ctrl\d+>/g, ""); 
    clean = clean.replace(/\\`\\`\\`/g, "```"); 
    clean = clean.replace(/\\`/g, "`");
    return clean.trim();
}

function getUserHistory(userId) {
    if (!chatHistory.has(userId)) chatHistory.set(userId, []);
    return chatHistory.get(userId);
}

function addToHistory(userId, role, partsArray) {
    const history = getUserHistory(userId);
    const validRole = (role.toLowerCase() === 'user') ? 'user' : 'model';
    history.push({ role: validRole, parts: partsArray });
    if (history.length > 10) history.splice(0, history.length - 10);
}

async function fetchImageAsBase64(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return { 
            base64: buffer.toString('base64'), 
            mimeType: response.headers.get('content-type') 
        };
    } catch (error) {
        return null;
    }
}

async function generateWithRetry(generateFn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await generateFn();
        } catch (error) {
            if (error.status === 503 || error.message.includes('overloaded') || error.message.includes('UNAVAILABLE')) {
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
}

function getModelKey(modelName) {
    return modelName.replace(/[\.-]/g, '_');
}

function isModelRpmBlocked(modelName) {
    const blockUntil = rpmBlocklist.get(modelName);
    if (blockUntil && Date.now() < blockUntil) {
        return true;
    }
    rpmBlocklist.delete(modelName);
    return false;
}

function checkAndResetRPD() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (modelConfig.last_reset_date !== today) {
        for (let key in modelConfig.models) {
            modelConfig.models[key].day_count = 0;
        }
        modelConfig.last_reset_date = today;
    }
}

function getModelForRequest(customModel) {
    checkAndResetRPD();

    if (customModel) {
        const modelName = customModel.toLowerCase();
        const modelKey = getModelKey(modelName);

        if (modelConfig.models[modelKey]) {
            const model = modelConfig.models[modelKey];
            if (model.day_count >= model.rpd_limit) return { error: `Daily limit reached for ${modelName}` };
            if (isModelRpmBlocked(modelName)) return { error: `Temporarily blocked ${modelName}` };
            return { model: modelName, isCustom: false };
        }
        return { model: modelName, isCustom: true };
    }

    for (const modelName of modelConfig.priority) {
        const modelKey = getModelKey(modelName);
        const model = modelConfig.models[modelKey];

        if (!model) continue;
        if (model.day_count >= model.rpd_limit) continue;
        if (isModelRpmBlocked(modelName)) continue;

        return { model: modelName, isCustom: false };
    }

    return { error: 'All models exhausted.' };
}

function logModelUsage(modelName) {
    const modelKey = getModelKey(modelName);
    if (modelConfig.models[modelKey]) {
        modelConfig.models[modelKey].day_count += 1;
    }
}

async function getGeminiResponse(prompt, userId, options = {}) {
    // img වෙනුවට media සහ mime භාවිතා කරමු
    const { gmd, bn, media, mime, model: customModel } = options;
    const ai = getAiClient();

    // userId = SN (Sender Number)
    // own = BN (Bot Number)
    // gmd = Group Metadata
    const contextData = `
<current_user_context>
    <![CDATA[
    * **SN (Sender JID) (m.sender):** ${userId}
    * **BN (Bot JID):** ${bn || 'Unknown'}
    ]]>
</current_user_context>

<current_group_context>
    <![CDATA[
    ${typeof gmd === 'object' ? JSON.stringify(gmd) : gmd}
    ]]>
</current_group_context>
`;

    const dusp = usp.replace('</system_prompt>', `${contextData}\n</system_prompt>`);

    if (prompt.trim().toLowerCase() === 'clear') {
        if (chatHistory.has(userId)) chatHistory.delete(userId);
        return { status: true, text: "Chat history cleared. ✅" };
    }

    let retryCount = 0;
    const maxRetries = 6;
    let customModelForLoop = customModel;

    while (retryCount < maxRetries) {
        retryCount++;

        const modelSelection = getModelForRequest(customModelForLoop);

        if (modelSelection.error) {
            return { status: false, error: modelSelection.error };
        }

        const { model: modelName, isCustom } = modelSelection;

        try {
            let resultText = "";
            let history = getUserHistory(userId);
            let messageParts = [{ text: prompt }];

            // Media සැකසීම (Image, Video, Audio, Sticker)
            if (media && mime) {
                let mediaData = null;

                if (Buffer.isBuffer(media)) {
                    mediaData = {
                        mimeType: mime, // දැන් මෙය dynamic වේ
                        base64: media.toString('base64')
                    };
                } else if (typeof media === 'string') {
                    // URL එකක් නම්
                    mediaData = await fetchImageAsBase64(media);
                    if (mediaData) mediaData.mimeType = mime; // URL එකෙන් එන mime එක නැත්නම් අපේ එක දානවා
                }

                if (mediaData) {
                    messageParts.push({ inlineData: { mimeType: mediaData.mimeType, data: mediaData.base64 } });
                }
            }

            if (modelName === "gemma-3-27b-it") {
                const contents = [...history, { role: 'user', parts: messageParts }];
                const gemmaRequestBody = { contents: contents };
                const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${DEFAULT_API_KEY}`;

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(gemmaRequestBody)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Gemma API Error: ${errorData.error?.message || 'Unknown error'}`);
                }
                const data = await response.json();
                resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            } else {
                const contents = [...history, { role: 'user', parts: messageParts }];

                const generationRequest = {
                    model: modelName,
                    contents: contents,
                    config: { systemInstruction: dusp }
                };

                const modelsWithSearch = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
                if (modelsWithSearch.includes(modelName)) {
                    generationRequest.config.tools = [{ googleSearch: {} }];
                }

                const genResult = await generateWithRetry(() => ai.models.generateContent(generationRequest));
                resultText = genResult.candidates?.[0]?.content?.parts?.[0]?.text || "";
            }

            let reply = cleanRawGeminiOutput(resultText);

            addToHistory(userId, 'user', messageParts);
            addToHistory(userId, 'model', [{ text: reply }]);

            if (!isCustom) {
                logModelUsage(modelName);
            }

            return {
                status: true,
                text: reply,
                model: modelName
            };

        } catch (error) {

            const lowerMsg = error.message.toLowerCase();
            const is429 = lowerMsg.includes('429') || lowerMsg.includes('quota') || lowerMsg.includes('exhausted') || lowerMsg.includes('overloaded');

            if (is429) {
                if (lowerMsg.includes('daily') || lowerMsg.includes('per day')) {
                    const modelKey = getModelKey(modelName);
                    if (modelConfig.models[modelKey]) modelConfig.models[modelKey].day_count = modelConfig.models[modelKey].rpd_limit;
                } else {
                    rpmBlocklist.set(modelName, Date.now() + 60000);
                }
                customModelForLoop = null;
                continue;
            }

            return { status: false, error: error.message };
        }
    }

    return { status: false, error: 'All models exhausted.' };
}



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
        if (!userMessage) return await reply(`*Example:* \`${prefix}gemini who is visper?\``);

        const response = await getGeminiResponse(userMessage, m.sender);

        if (response.status) {
            await reply(response.text);
        } else {
            await reply(`❌ *Error:* ${response.error}`);
        }

    } catch (error) {
        console.error("Gemini Command Error:", error);
        await reply("❌ *An internal error occurred.*");
    }
});

cmd({ on: "body" },
    async (conn, mek, m, { from, body, isCmd, isOwner, botNumber2, sender, pushname, isGroup, reply, senderNumber, isBotAdmins, isAdmins, botNumber }) => {
        try {
            if (config.CHAT_BOT) {
                if (m.fromMe) return;

                // --- 1. පණිවිඩ සහ Media හඳුනා ගැනීම ---
                const msgType = m.type;
                const quotedType = m.quoted ? m.quoted.type : null;

                const isImage = msgType === 'imageMessage';
                const isVideo = msgType === 'videoMessage';
                const isAudio = msgType === 'audioMessage' || msgType === 'voiceMessage';
                const isSticker = msgType === 'stickerMessage';

                const isQuotedImage = quotedType === 'imageMessage';
                const isQuotedVideo = quotedType === 'videoMessage';
                const isQuotedAudio = quotedType === 'audioMessage' || quotedType === 'voiceMessage';
                const isQuotedSticker = quotedType === 'stickerMessage';

                // Bot ව mention කර ඇත්දැයි බැලීම
                let isTrue = (
                    m?.mentionUser?.includes(botNumber2) ||
                    (m.quoted && m.quoted.sender === botNumber2)
                );

                if (!isTrue) return;
                // Command එකක් නම් හෝ ඉලක්කම් පමණක් නම් AI එක වැඩ නොකරයි
                if (!isNaN(m.body) || isCmd) return;

                        // --- මෙතනින් පටන් ගන්න ---

        // 1. දැනට එවූ මැසේජ් එක (Text or Caption)
        let inputText = m.body ? m.body : (m.caption || m.msg?.caption || "");

        // 2. Reply (Quote) කරපු මැසේජ් එකේ Text එක ගැනීම
        let quotedText = "";
        if (m.quoted) {
            quotedText = m.quoted.text || m.quoted.caption || m.quoted.body || m.quoted.conversation || "";
        }

        // 3. Quoted Text එකක් තියෙනවා නම්, එය AI එකට තේරෙන විදියට සකසනවා
        if (quotedText) {
            const cleanUserMsg = inputText.replace(/@\d+/g, '').trim();
            inputText = `[Context/Quoted Message]:\n"${quotedText}"\n\n[User's Question]:\n"${cleanUserMsg}"`;
        }

        // --- මෙතනින් ඉවරයි ---

                // Media එකක් නම් සහ text එකක් නැත්නම් default prompt එකක්
                if (!inputText) {
                    if (isImage || isQuotedImage || isSticker || isQuotedSticker) inputText = "Describe this image/sticker details";
                    else if (isVideo || isQuotedVideo) inputText = "Watch this video and describe what happens";
                    else if (isAudio || isQuotedAudio) inputText = "Listen to this audio and explain content";
                    else inputText = "Hi Gemini";
                }

                inputText = inputText.replace(/@\d+/g, '').trim();
                const lowerCaseText = inputText.toLowerCase();

                let mediaBuffer = null;
                let mimeType = null;

                // --- 2. Media Download (With 8MB Limit) ---
                const sizeLimit = 8 * 1024 * 1024; // 8MB

                if (isImage || isVideo || isAudio || isSticker) {
                    // Direct Video 8MB ට වැඩිදැයි බැලීම
                    if (isVideo && (m.msg?.fileLength > sizeLimit)) {
                        await reply("⚠️ Video is too large (>8MB). Analyzing text only.");
                    } else {
                        mediaBuffer = await m.download();
                        if (isImage) mimeType = "image/jpeg";
                        else if (isVideo) mimeType = "video/mp4";
                        else if (isAudio) mimeType = "audio/mp3";
                        else if (isSticker) mimeType = "image/webp";
                    }
                } 
                else if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedSticker) {
                    // Quoted Video 8MB ට වැඩිදැයි බැලීම
                    let fileLength = m.quoted.msg?.fileLength || m.quoted.fileLength || 0;

                    if (isQuotedVideo && fileLength > sizeLimit) {
                        await reply("⚠️ Quoted Video is too large (>8MB). Analyzing text only.");
                    } else {
                        mediaBuffer = await m.quoted.download();
                        if (isQuotedImage) mimeType = "image/jpeg";
                        else if (isQuotedVideo) mimeType = "video/mp4";
                        else if (isQuotedAudio) mimeType = "audio/mp3";
                        else if (isQuotedSticker) mimeType = "image/webp";
                    }
                }

                // Group Metadata
                let gmd;
                if (isGroup) {
                    gmd = await conn.groupMetadata(from);
                } else {
                    gmd = "This Not A group, This private chat. Inbox.";
                }

                let botN = botNumber;

                // --- 3. Gemini වෙත යැවීම ---
                const response = await getGeminiResponse(lowerCaseText, m.sender, {
                    media: mediaBuffer, 
                    mime: mimeType,     
                    gmd: gmd,
                    bn: botN
                });

                if (response.status) {
                    const aiText = response.text;
                    // Action Codes වෙන් කර ගැනීම
                    const actionMatch = aiText.match(/\*ACTION_CODE:\*\s*([^\n|]+)/);
                    const oxpMatch = aiText.match(/\*OXP:\*\s*([^\n|]+)/);
                    const msgMatch = aiText.match(/\*MSG:\*\s*(.+)/s);

                    // --- 4. If-Else Action Logic ---
                    if (actionMatch) {
                        const action = actionMatch[1].trim();
                        const rawTarget = oxpMatch ? oxpMatch[1].trim() : "";
                        const replyMsg = msgMatch ? msgMatch[1].trim() : aiText;

                        let cmdName = null;

                        // ********************************************
                        // ඔබේ බොට්ගේ Command වල නම් මෙතන වෙනස් කරන්න
                        // ********************************************
                        if (action === "add_user") {
                            cmdName = "add";
                        } 
                        else if (action === "kick_user") {
                            cmdName = "kick";
                        } 
                        else if (action === "promote_user") {
                            cmdName = "promote";
                        } 
                        else if (action === "demote_user") {
                            cmdName = "demote";
                        } 
                        else if (action === "mute_group") {
                            cmdName = "mute";
                        } 
                        else if (action === "unmute_group") {
                            cmdName = "unmute";
                        } 
                        else if (action === "DL_YT_AUDIO") {
                            cmdName = "song"; // හෝ "play"
                        } 
                        else if (action === "DL_YT_VIDEO") {
                            cmdName = "video";
                        } 
                        else if (action === "REQ_IMAGINE") {
                            cmdName = "img";  // හෝ "imagine"
                        }

                        // Command එක Execute කිරීම
                        if (cmdName) {
                            const targetCmd = commands.find(c => c.pattern === cmdName);

                            if (targetCmd) {
                                await reply(replyMsg); // AI මැසේජ් එක යවයි

                                try {
                                    // බොට්ගේ Command function එකට දත්ත යවයි
                                    await targetCmd.function(conn, mek, m, {
                                        from,
                                        body,
                                        isCmd: true,
                                        isOwner,
                                        botNumber2,
                                        sender,
                                        pushname,
                                        isGroup,
                                        reply,
                                        senderNumber,
                                        isBotAdmins,
                                        isAdmins,
                                        botNumber,
                                        command: cmdName,
                                        args: rawTarget.split(" "),
                                        q: rawTarget,
                                        text: rawTarget
                                    });
                                } catch (err) {
                                    console.error(`Error executing command ${cmdName}:`, err);
                                    await reply("❌ විධානය ක්‍රියාත්මක කිරීමට නොහැකි විය.");
                                }
                            } else {
                                await reply(replyMsg + `\n(Bot Error: '${cmdName}' command not found)`);
                            }
                        } else {
                            // Action තිබුනත් Command එකක් Assign කර නැත්නම්
                            await reply(replyMsg);
                        }

                    } else {
                        // Action නැති සාමාන්‍ය කතාබහ
                        await reply(aiText);
                    }

                } else {
                    await reply(`❌ *Error:* ${response.error}`);
                }
            }
        } catch (e) {
            console.error(e);
            await reply("❌ *An error occurred while processing your request.* " + e);
        }
    }
);