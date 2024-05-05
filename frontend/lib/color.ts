export const scoreToColor = (score: number) => {
    if (score < 0.2) return "bg-score-0";
    if (score < 0.4) return "bg-score-1";
    if (score < 0.6) return "bg-score-2";
    if (score < 0.8) return "bg-score-3";
    return "bg-score-4";
};
