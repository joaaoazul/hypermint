
import { GoogleGenAI } from "@google/genai";
import { TokenFormState, TokenType, GeneratedSiteContent } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to avoid immediate errors, handle gracefully in calls
const ai = new GoogleGenAI({ apiKey });

export const generateTokenMetadata = async (name: string, ticker: string): Promise<string> => {
  if (!apiKey) return "The next 1000x gem waiting for you. 💎🙌 (AI Unavailable)";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a "degen" crypto trader on Solana. Write a description for a new meme coin.
      
      Coin Name: "${name}"
      Ticker: "$${ticker}"
      
      Requirements:
      - Max 180 characters.
      - Use internet slang (moon, ape, gem, based).
      - Use 2-3 emojis.
      - Be funny and high energy.
      - Do not include hashtags.
      
      Output only the description text.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || "To the moon! 🚀";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "The next 1000x gem waiting for you. 💎🙌";
  }
};

export const generateWhitepaperSummary = async (name: string, ticker: string, type: string): Promise<string> => {
  if (!apiKey) return "Whitepaper generation unavailable without API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a 3-bullet point executive summary for a crypto whitepaper. Token: ${name} ($${ticker}). Type: ${type}. Professional but hype tone.`,
    });
    return response.text?.trim() || "Summary unavailable.";
  } catch (error) {
    return "Could not generate summary.";
  }
};

export const chatWithAI = async (userMessage: string): Promise<string> => {
  if (!apiKey) return "I'm currently offline (No API Key). Check back later!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are "MemeBot", a helpful crypto assistant for a token launchpad. 
      Answer the user's question about crypto, tokenomics, or safety briefly (max 2 sentences).
      User: ${userMessage}`,
    });
    return response.text?.trim() || "I didn't catch that.";
  } catch (error) {
    return "System overload. Try again.";
  }
};

export const parseTokenIntent = async (prompt: string): Promise<Partial<TokenFormState>> => {
  if (!apiKey) return {};

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Extract token configuration from the following text. Return a JSON object ONLY.
        Text: "${prompt}"
        
        Fields to extract if present (infer reasonable defaults if vague):
        - name (string)
        - ticker (string, uppercase)
        - description (string)
        - tokenType (one of: 'standard', 'deflationary', 'reflection', 'dao')
        - tokenomics: { buyTax (0-10), sellTax (0-10), marketingWallet (0-10) }
        - antiBot (boolean)
        - chain (one of: 'SOL', 'ETH', 'BASE', 'ARB', 'BSC')
        
        Example JSON:
        { "name": "MoonDog", "ticker": "MDOG", "tokenType": "deflationary", "tokenomics": { "buyTax": 5, "sellTax": 5 }, "antiBot": true, "chain": "SOL" }
      `,
    });

    const text = response.text || "";
    // Simple regex to find JSON block if markdown is included
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  } catch (e) {
    console.error("Failed to parse intent", e);
    return {};
  }
}

export const generateWebsiteContent = async (name: string, ticker: string, description: string): Promise<GeneratedSiteContent | null> => {
    if (!apiKey) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
            Generate content for a meme coin landing page. Return ONLY valid JSON.
            Token: ${name} (${ticker})
            Description: ${description}

            Structure:
            {
              "heroHeadline": "Catchy 5-word headline",
              "heroSubheadline": "One sentence pitch",
              "aboutTitle": "About ${name}",
              "aboutText": "2 sentences explaining the lore",
              "roadmapSteps": [{"title": "Phase 1", "description": "Launch"}, {"title": "Phase 2", "description": "CEX"}],
              "features": [{"title": "Safe", "icon": "🛡️"}, {"title": "Fast", "icon": "⚡"}],
              "colorPalette": {"primary": "#Hex", "secondary": "#Hex", "background": "#Hex"}
            }
            `
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (e) {
        console.error("Failed to generate site", e);
        return null;
    }
}
