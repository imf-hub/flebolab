import fs from 'node:fs';
import path from 'node:path';
const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
let text='# Avisos de bibliotecas de terceros\n\nInventario de la resolución instalada. Las licencias de medios clínicos, anatomía e ilustración están documentadas separadamente en sus catálogos y Créditos. Este archivo conserva avisos de código; no cambia las licencias de sus autores.\n\n';
let count=0;
for(const [dir,entry] of Object.entries(lock.packages)){
 if(!dir||!fs.existsSync(path.join(dir,'package.json')))continue;
 const pkg=JSON.parse(fs.readFileSync(path.join(dir,'package.json'),'utf8'));
 text+=`## ${pkg.name}@${pkg.version}\n\nLicencia declarada: ${typeof pkg.license==='string'?pkg.license:JSON.stringify(pkg.license??entry.license??'Consultar autor')}. ${entry.dev?'Herramienta de desarrollo.':'Dependencia de aplicación o transitiva.'}\n\n`;
 const names=fs.readdirSync(dir).filter(n=>/^(license|licence|copying|notice)(\.|$)/i.test(n));
 for(const name of names){const full=path.join(dir,name);if(!fs.statSync(full).isFile()||fs.statSync(full).size>100000)continue;const body=fs.readFileSync(full,'utf8');text+=`Archivo ${name}:\n\n${body.split('\n').map(l=>l.trimEnd()?'    '+l.trimEnd():'').join('\n')}\n\n`;}
 count++;
}
fs.writeFileSync('docs/THIRD_PARTY_NOTICES.md',text);
console.log(`Avisos conservados para ${count} paquetes instalados.`);
