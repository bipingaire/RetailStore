
const OpenAI = require('openai');
require('dotenv').config();

async function testOpenAI() {
    console.log('Testing OpenAI API Key...');
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY is missing in .env');
        return;
    }
    console.log('Key exists.');

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: "Hello" }],
        });
        console.log('✅ OpenAI Response:', response.choices[0].message.content);
    } catch (error) {
        console.error('❌ OpenAI Error:', error.message);
        if (error.status) console.error('Status Code:', error.status);
    }
}

testOpenAI();
