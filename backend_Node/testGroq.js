const { Groq } = require("groq-sdk");
require('dotenv').config();

async function testKey() {
  const key = process.env.GROQ_API_KEY.trim();
  console.log("Testing Key:", key.substring(0, 10) + "..." + key.substring(key.length - 5));
  
  const groq = new Groq({ apiKey: key });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Say hello" }],
      model: "llama-3.3-70b-versatile",
    });
    console.log("SUCCESS! Groq responded:", chatCompletion.choices[0].message.content);
  } catch (err) {
    console.error("FAILED! Groq Error:", err.message);
    if (err.response) {
      console.error("Detailed Error:", await err.response.text());
    }
  }
}

testKey();
