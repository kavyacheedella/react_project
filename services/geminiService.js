import { GoogleGenAI, Type } from "@google/genai";
// Initialize with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
/**
 * Cache implementation with session persistence to save quota.
 */
const CACHE_PREFIX = 'lumina_cache_';
const getFromCache = (key) => {
    try {
        const cached = sessionStorage.getItem(CACHE_PREFIX + key);
        return cached ? JSON.parse(cached) : null;
    }
    catch {
        return null;
    }
};
const saveToCache = (key, data) => {
    try {
        sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
    }
    catch (e) {
        // If quota exceeded in sessionStorage, clear it
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            sessionStorage.clear();
        }
    }
};
/**
 * Request Queue to handle strict rate limits of the Gemini Free Tier.
 * This ensures we never fire multiple requests simultaneously and
 * maintains a healthy gap between them.
 */
class RequestQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.lastRequestTime = 0;
        this.minInterval = 2000; // 2 seconds between requests for safety
    }
    async add(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    // Wait for the minimum interval to pass
                    const now = Date.now();
                    const timeSinceLast = now - this.lastRequestTime;
                    if (timeSinceLast < this.minInterval) {
                        await new Promise(r => setTimeout(r, this.minInterval - timeSinceLast));
                    }
                    const result = await fn();
                    this.lastRequestTime = Date.now();
                    resolve(result);
                }
                catch (e) {
                    reject(e);
                }
            });
            this.process();
        });
    }
    async process() {
        if (this.processing || this.queue.length === 0)
            return;
        this.processing = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task)
                await task();
        }
        this.processing = false;
    }
}
const limiter = new RequestQueue();
/**
 * Utility for exponential backoff retries.
 */
async function withRetry(fn, retries = 4, delay = 2000) {
    try {
        return await fn();
    }
    catch (error) {
        const errorStr = JSON.stringify(error).toLowerCase();
        const isRateLimit = errorStr.includes('429') || errorStr.includes('resource_exhausted') || errorStr.includes('limit');
        if (isRateLimit && retries > 0) {
            console.warn(`Gemini rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2.5); // More aggressive backoff
        }
        throw error;
    }
}
/**
 * Orchestrates cached, queued, and retried requests.
 */
async function smartRequest(key, fetcher) {
    const cached = getFromCache(key);
    if (cached)
        return cached;
    return limiter.add(() => withRetry(async () => {
        const data = await fetcher();
        saveToCache(key, data);
        return data;
    }));
}
export const getBookRecommendations = async (userPrompt) => {
    const cacheKey = `recommendations-${userPrompt.substring(0, 50)}`;
    try {
        return await smartRequest(cacheKey, async () => {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Suggest 3 books based on the following preference: "${userPrompt}". Provide the titles and a short reason why for each. Format as JSON.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                reason: { type: Type.STRING }
                            },
                            required: ["title", "reason"]
                        }
                    }
                }
            });
            return JSON.parse(response.text || "[]");
        });
    }
    catch (error) {
        console.error("Gemini Recommendation Error:", error);
        return [];
    }
};
export const getBookSummary = async (bookTitle) => {
    const cacheKey = `summary-${bookTitle}`;
    try {
        return await smartRequest(cacheKey, async () => {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Give me a concise 2-sentence literary analysis for the book titled "${bookTitle}".`,
            });
            return response.text || "Analysis unavailable.";
        });
    }
    catch (error) {
        return "Analysis unavailable at the moment.";
    }
};
export const getAuthorBio = async (authorName) => {
    const cacheKey = `bio-short-${authorName}`;
    try {
        return await smartRequest(cacheKey, async () => {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Provide a 1-sentence short biography for the author ${authorName}. Keep it under 15 words and professional.`,
            });
            return response.text?.trim() || "A distinguished voice in contemporary literature.";
        });
    }
    catch (error) {
        return "A distinguished voice in contemporary literature.";
    }
};
export const getFullAuthorBio = async (authorName) => {
    const cacheKey = `bio-full-${authorName}`;
    try {
        return await smartRequest(cacheKey, async () => {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Write a 3-sentence professional literary biography for the author ${authorName}. Focus on their style and impact.`,
            });
            return response.text?.trim() || "An author known for their profound impact on contemporary literature.";
        });
    }
    catch (error) {
        return "Biography unavailable.";
    }
};
export const getAuthorQuote = async (authorName) => {
    const cacheKey = `quote-${authorName}`;
    try {
        return await smartRequest(cacheKey, async () => {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Generate a fictional but characteristic philosophical quote about writing or life that sounds like it was said by the author ${authorName}. Do not include the author's name in the quote string itself.`,
            });
            return response.text?.trim().replace(/^"|"$/g, '') || "Words are the only windows that never close.";
        });
    }
    catch (error) {
        return "The silence between words is where the real story lives.";
    }
};
export const getRandomLiteraryQuote = async () => {
    try {
        // Note: Quotes don't use smartRequest to ensure variety, but still use limiter and retry
        const response = await limiter.add(() => withRetry(async () => ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Provide one famous, short, inspirational literary quote (max 15 words) and its author. Format as JSON with "text" and "author" keys.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        author: { type: Type.STRING }
                    },
                    required: ["text", "author"]
                }
            }
        })));
        return JSON.parse(response.text || '{"text": "A room without books is like a body without a soul.", "author": "Cicero"}');
    }
    catch (error) {
        return { text: "A room without books is like a body without a soul.", author: "Cicero" };
    }
};
