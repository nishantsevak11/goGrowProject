import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyBH2NGDcD4X091Dbl036R0odD_L8mhSORg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Cache to store user-specific responses for the day
const contentCache = new Map();

// Function to generate a cache key (per user + categories + timestamp)
const generateCacheKey = (name, categories) => {
    const timestamp = new Date().toISOString();  // Add timestamp to ensure uniqueness
    const randomString = Math.random().toString(36).substring(7); // Random string to add more variation
    return `${name}-${categories}-${timestamp}-${randomString}`;
};

// Function to generate personalized AI content
export const generateContent = async (categories="productivity", name, AiPrompt) => {
    try {
        console.log(`Generating personalized content for ${name}`);

        const cacheKey = generateCacheKey(name, categories);

        // Check cache to avoid redundant AI requests
        if (contentCache.has(cacheKey)) {
            console.log('Using cached content for today');
            return contentCache.get(cacheKey);
        }

        // Refined AI Prompt for personalization
        const prompt = `
        Act as an engaging and friendly AI companion.
        Generate a **personalized** message for **${name}** based on their interests in **${categories}**.
        
        **User's request:** "${AiPrompt}"
        
        💡 Make it warm, engaging, and inspiring.
        🎨 Use HTML formatting for styling.
        ✨ Add **emojis** where appropriate.
        📌 Ensure every response is **unique** and **highly engaging**.
        💬 Call-to-action: Encourage ${name} to explore our services!
        `;

        console.log('Sending prompt to Gemini:', prompt);

        // Generate content
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Format with HTML styling
        const formattedContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>✨ Hey <b>${name}</b>! Here's something special for you:</p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ff9800;">
                    ${text}
                </blockquote>
                <p style="font-size: 14px; font-style: italic; color: #666;">
                    💡 Generated just for <b>${name}</b> by <b>Subh Chintak AI</b>.  
                    Keep shining! 🌟
                </p>
            </div>
        `;

        // Store in cache
        contentCache.set(cacheKey, formattedContent);

        console.log('Successfully generated unique content', formattedContent);
        return formattedContent;

    } catch (error) {
        console.error('Error generating content:', error);

        // Fallback response
        return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Hey ${name}! 🌟</p>
                <p>Sometimes, technology takes a break too! But remember, you are unstoppable. Keep chasing your dreams. 🚀</p>
                <p style="font-style: italic; color: #666;">
                    "The only limit to our realization of tomorrow is our doubts of today." - Franklin D. Roosevelt
                </p>
            </div>
        `;
    }
};
