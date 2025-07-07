export function getSeedFromDate(date: Date): number {
    const dateStr = date.toISOString().split("T")[0];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10_000;
    return x - Math.floor(x);
}
