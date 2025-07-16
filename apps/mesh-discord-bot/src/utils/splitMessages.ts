export function splitMessages(text: string, maxLength = 2000): string[] {
    const lines = text.split("\n");
    const chunks: string[] = [];
    let currentChunk: string[] = [];

    const pushChunk = () => {
        const chunkText = currentChunk.join("\n").trim();
        if(chunkText.length <= maxLength) {
            chunks.push(chunkText);
        } else {
            let start = 0;
            while(start < chunkText.length) {
                chunks.push(chunkText.slice(start, start + maxLength));
                start += maxLength;
            }
        }
        currentChunk = [];
    }

    for(const line of lines) {
        let cleanedLine = line.trimEnd();
        const isHeading = cleanedLine.startsWith("#### ") || cleanedLine.startsWith("### ") || cleanedLine.startsWith("## ") || cleanedLine.startsWith("# ") || cleanedLine.startsWith("```javascript") || cleanedLine.startsWith("```tsx");
        const tentativeChunk = [...currentChunk, cleanedLine].join("\n");

        if(tentativeChunk.length > maxLength) {
            pushChunk();
        }

        if(isHeading && currentChunk.join("\n").length > maxLength * 0.85) {
            pushChunk();
        }

        if (cleanedLine.startsWith("#### ")) {
            const content = cleanedLine.replace(/^####\s*/, "");
            cleanedLine = `**${content}**`;
        }
        
        currentChunk.push(cleanedLine);
    }

    if(currentChunk.length > 0) {
        pushChunk();
    }

    return chunks.map(chunk => chunk.replace(/\n{3,}/g, "\n\n"));
}