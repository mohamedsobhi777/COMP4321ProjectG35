export function parseTokens(input: string): string[] {
    const tokens: string[] = [];
    let currentToken = "";
    let insideQuotes = false;

    for (const char of input) {
        if (char === '"') {
            insideQuotes = !insideQuotes;
            if (!insideQuotes) {
                tokens.push(currentToken);
                currentToken = "";
            }
        } else if (char === " " && !insideQuotes) {
            if (currentToken.length > 0) {
                tokens.push(currentToken);
                currentToken = "";
            }
        } else {
            currentToken += char;
        }
    }

    if (currentToken.length > 0) {
        tokens.push(currentToken);
    }

    return tokens;
}
