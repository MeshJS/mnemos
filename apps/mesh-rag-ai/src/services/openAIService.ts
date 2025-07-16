import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const openaiApiKey = process.env.OPENAI_API_KEY;
if(!openaiApiKey) {
    throw new Error("OPENAI_API_KEY must be define in .env");
}

const openai = new OpenAI({ apiKey: openaiApiKey });


// helper fn to get embeddings from openai
export async function getEmbedding(text: string): Promise<number []> {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
            encoding_format: "float",
        });

        return response.data[0].embedding;
    } catch(error) {
        console.error("Error generating embedding: ", error);
        throw error;
    }
}


// helper fn to get answers from opanai
export async function getAnswerFromOpenAI(question: string, context: string): Promise<string> {
    try {
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: 'You are a MeshJS documentation expert. You are helping developers integrate blockchain functionality into web applications.You must generate the outputs clean, well-formatted MDX without escaped \\n characters.\\n\\n' +
                    'Use:\\n' +
                    '- Markdown headers (##, ###)\\n' +
                    '- Code blocks with proper language labels (```tsx, ```js)\\n' +
                    '- Bullet points and numbered lists\\n' +
                    '- Import/export statements if needed\\n' +
                    '- NEVER wrap the whole response in a single backtick block\\n\\n' +
                    "Do not omit details. If unsure, clearly say you don't know.",
            },
            {
                role: "user",
                content: `Context: ${context}
                
                Question: ${question}`,
            },
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.1,
        });

        return response.choices[0].message?.content?.trim() || "No answer generated";
    } catch(error) {
        console.error("Error getting answer from OpenAI:", error);
        throw error;
    }
}