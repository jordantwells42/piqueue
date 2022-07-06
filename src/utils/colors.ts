export function importanceToColor(score: number){
    const colors = ["bg-emerald-300", "bg-green-300" , "bg-lime-200", "bg-yellow-200", "bg-orange-300", "bg-rose-300", "bg-red-400", "bg-fuchsia-400", "bg-purple-500", "bg-violet-500", "bg-indigo-500"];
    return colors[Math.floor(score*10)];
}

