const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function checkModels() {
  try {
    const list = await openai.models.list();
    const gptModels = list.data
      .filter(m => m.id.includes('gpt') || m.id.includes('o1') || m.id.includes('o3'))
      .map(m => m.id)
      .sort();
    console.log("Available GPT/o1/o3 models for this API key:");
    console.log(gptModels.join('\n'));
  } catch (err) {
    console.error("Error fetching models:", err.message);
  }
}

checkModels();
