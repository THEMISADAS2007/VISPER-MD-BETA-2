import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Catbox.moe File Uploader
 * @param {string} filePath - Path to the local file
 * @param {string} userhash - Optional account hash
 */
const catboxUploader = async (filePath, userhash = '') => {
  try {
    const url = 'https://catbox.moe/user/api.php';
    const form = new FormData();

    form.append('reqtype', 'fileupload');
    form.append('userhash', userhash);
    form.append('fileToUpload', fs.createReadStream(filePath));

    const response = await axios.post(url, form, {
      headers: { ...form.getHeaders() },
    });

    // Oyaage format ekata return eka hadala thiyenne
    return {
      status: true,
      result: {
        url: response.data // Catbox direct link eka
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export = { catboxUploader };
