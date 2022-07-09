export function importanceToColor(score: number){
    const colors = ["bg-pico-blue", "bg-pico-green", "bg-pico-yellow", "bg-pico-orange", "bg-pico-red"];
    if (score === 1){
        return colors[colors.length - 1]
    }
    return colors[Math.floor(score*5)];
}

