export function importanceToColor(score: number){
    const colors = ["bg-emerald-400", "bg-green-400" , "bg-lime-400", "bg-yellow-400", "bg-orange-400", "bg-rose-400", "bg-red-400", "bg-fuchsia-400", "bg-purple-400", "bg-violet-400", "bg-indigo-400"];
    return colors[Math.floor(score*10)];
}

