const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

//gg
module.exports = {
SESSION_ID:'VISPER-MD&497966f0-f8b3-4fb5-9a23-aaebb5569e27',


SESSION_ID2: '', // තිබේ නම් පමණක් (Optional)
SESSION_ID3: '', // තිබේ නම් පමණක් (Optional)   
ANTI_DELETE: process.env.ANTI_DELETE === undefined ? 'true' : process.env.ANTI_DELETE, 
MV_BLOCK: process.env. MV_BLOCK === undefined ? 'true' : process.env. MV_BLOCK,    
ANTI_LINK: process.env.ANTI_LINK === undefined ? 'true' : process.env.ANTI_LINK, 
SEEDR_MAIL: '',
SEEDR_PASSWORD: '',
SUDO: '',//
DB_NAME: 'pramaaaataaaaaaaaaaaaajjaa',
LANG: 'SI',
OWNER_NUMBER: '94724884317',
TG_GROUP: 'https://t.me/+Zm865mJ_TL0yNGVl'

};
//GITHUB_AUTH_TdOKEN: 'ouvnI0xSDsmfWA1filVxx.SZ0vJGYkjlC5VX54U0e10',

