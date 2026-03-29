const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//@DESC Generate a book outline
//@route POST /api/ai/generate-outline
//@access private
const generateOutline = async (req, res) => {
    try {
        const { topic, style, numChapters, description } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        const prompt = `You are an expert ebook writer.Create a structured chapter outline for an ebook based on the following details:

            Topic: ${topic}
            Writing Style: ${style || "informative"}
            Number of Chapters: ${numChapters || 5}
            Description: ${description || "No additional description provided"}

            Requirements:
            - Generate exactly ${numChapters || 5} chapters.
            - Each chapter must include:
            - chapterNumber
            - title
            - shortSummary
            - Keep summaries concise (2-3 sentences).
            - Make titles engaging and relevant to the topic.

            IMPORTANT:
            Return ONLY a valid JSON array.
            Do not include explanations, markdown, or extra text.

            Example format:

            [
            {
                "chapterNumber": 1,
                "title": "Introduction to the Topic",
                "shortSummary": "Brief explanation of what the topic is and why it is important."
            },
            {
                "chapterNumber": 2,
                "title": "Core Concepts",
                "shortSummary": "Explains the fundamental ideas needed to understand the topic."
            }]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const text = response.text;

        //find and extract the JSON array from the response text
        const startIndex = text.indexOf('[');
        const endIndex = text.lastIndexOf(']');

        if (startIndex === -1 || endIndex === -1) {
            console.error("No JSON array found in AI response:", text);
            return res.status(500).json({ message: "No JSON array found in AI response" });
        }

        const jsonString = text.substring(startIndex, endIndex + 1);

        //validate if the response is valid JSON
        try {
            const outline = JSON.parse(jsonString);
            res.status(200).json({ outline });
        } catch (error) {
            console.error("Error parsing AI response:", jsonString);
            return res.status(500).json({ message: "Failed to generate a valid outline" });
        }

    } catch (error) {
        console.error("Error generating outline:", error);
        res.status(500).json({ message: "Server error during AI outline generation" });
    }
};

//@DESC Generate content for a chapter
//@route POST /api/ai/generate-chapter-content
//@access private
const generateChapterContent = async (req, res) => {
    try {
        const { chapterTitle, chapterDesciption, style } = req.body;

        if (!chapterTitle) {
            return res.status(400).json({ message: "Chapter Title is required" });
        }

        const prompt = `You are a professional ebook writer.Write a complete ebook chapter based on the following information.

            Chapter Title: ${chapterTitle}
            Chapter Description: ${chapterDesciption || "No description provided"}
            Writing Style: ${style || "informative"}

            Instructions:
            - Write a detailed and well-structured chapter.
            - Start with a short introduction to the topic.
            - Divide the content into clear sections with headings and subheadings.
            - Explain concepts clearly with examples where appropriate.
            - Keep the tone consistent with the selected writing style.
            - End the chapter with a short conclusion or summary.

            Important:
            Return only the chapter content in plain text.
            Do not include JSON, explanations, or extra commentary.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        res.status(200).json({ content: response.text });

    } catch (error) {
        console.error("Error generating chapter content:", error);
        res.status(500).json({ message: "Server error during AI chapter content generation" });
    }
};

module.exports = {
    generateOutline,
    generateChapterContent,
};