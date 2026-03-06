import Groq from "groq-sdk";
import "dotenv/config"; // automatically loads .env

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are the Skillverse Guider, an expert assistant for the Skillverse freelancing platform. 
          Your goal is to help freelancers find jobs and clients find talent. 
          - Be professional, encouraging, and witty.
          - Provide advice on profile SEO, writing winning proposals, and platform fees.
          - If a user asks about something unrelated to freelancing or Skillverse, politely guide them back.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile", // Using a high-performance Llama model
      temperature: 0.7,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "";

    res.status(200).json({
      success: true,
      reply: aiResponse,
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch response from Skillverse Guider" });
  }
};
