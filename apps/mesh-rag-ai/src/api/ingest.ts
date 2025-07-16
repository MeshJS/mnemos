import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ingestDocs } from "../ingest/ingestDocs";


let isDBReady = false;

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

    try {
        await ingestDocs();
        res.status(200).json({
            message: "Docs ingestion successful"
        });
    } catch (error: any) {
        console.error("Error ingesting the docs:", error.message || error);
        res.status(500).json({
            message: "Failed to ingest the docs"
        });
    }
}