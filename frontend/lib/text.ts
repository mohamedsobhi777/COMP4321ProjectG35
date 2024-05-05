export function clampText(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
}
