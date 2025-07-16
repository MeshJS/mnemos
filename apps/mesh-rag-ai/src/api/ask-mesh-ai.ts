import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askAI } from "../services/askAI";


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }

    const token = req.headers["x-api-key"];
    if(!token || token!== process.env.INGEST_KEY) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const question = req.body.question;
    if(typeof question !== "string" || !question.trim()) {
        return res.status(400).json({
            message: "Question must be non-empty string"
        });
    }

    try {
        const answer = await askAI(question);
        res.status(200).json({
            answer
        });
    } catch(error: any) {
        console.error("Error in ask-mesh-ai:", error.message || error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}