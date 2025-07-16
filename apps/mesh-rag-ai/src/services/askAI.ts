import { supabase } from "../supabase/supabaseClient";
import { getAnswerFromOpenAI, getEmbedding } from "./openAIService";


export async function askAI(question: string): Promise<string> {
    try {
        const queryEmbedding = await getEmbedding(question);
        const { data, error } = await supabase.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_threshold: 0,
            match_count: 3,
        });

        console.log(data);

        if(error) {
            console.error("Error retrieving documents from DB:", error.message);
            return "An error occured while retrieving information.";
        }

        if(!data || data.length === 0) {
            return "Couldn't find any relevant information to answer the question";
        }

        const context = data.map((doc: any) => doc.content).join("\n\n");

        const answer = await getAnswerFromOpenAI(question, context);
        return answer;
    } catch(error) {
        console.error("Error occured while asking question:", error);
        return "An unexpected error occured";
    }
}