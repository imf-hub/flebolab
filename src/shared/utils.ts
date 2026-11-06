export function download(name:string,data:string,type='text/plain'){const u=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);}
export function share(){navigator.clipboard?.writeText(location.href);}
export function fullscreen(el?:HTMLElement|null){if(document.fullscreenElement)document.exitFullscreen?.();else(el||document.documentElement).requestFullscreen?.();}
export function formatTime(n:number){return `${Math.floor(n/60)}:${Math.floor(n%60).toString().padStart(2,'0')}`;}
export function readLocal<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}}
export function saveLocal(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
