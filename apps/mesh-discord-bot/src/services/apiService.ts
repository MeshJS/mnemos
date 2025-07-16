import axios from "axios";

export async function askAI(question: string) {
    const baseUrl = process.env.API_BASE_URL;
    const apiKey = process.env.API_KEY;

    if(!baseUrl || !apiKey) {
        throw new Error("API_BASE_URL and API_KEY must be defined in .env")
    }

    console.log("making backend call");

    const response = await axios.post(`${baseUrl}/api/ask-mesh-ai`,
        { question },
        {
            headers: {
                "x-api-key": apiKey,
                "User-Agent": "MeshJS-TwitterBot/1.0",
                "X-Forwarded-For": "railway-bot",
                "Content-Type": "application/json"
            }
        }
    )

    return response.data;
}