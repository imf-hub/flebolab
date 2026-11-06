/* Auditoría independiente de dominio; no se importa en la aplicación. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const sourceFlag = process.argv.find(x => x.startsWith('--source='));
const sourcePath = path.resolve(root, sourceFlag ? sourceFlag.slice(9) : 'src/labs/twin/model.ts');
const original = fs.readFileSync(sourcePath, 'utf8');
const hash = crypto.createHash('sha256').update(original).digest('hex');
let generated = ts.transpile(original, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS });
const marker = 'const inputDeep = 0.48, inputSup = 0.22;';
if (!generated.includes(marker)) throw Error('Cambió el punto de instrumentación; revisar copia antes de continuar');
generated = generated.replace(marker, marker + '\n auditHook({t,k,steps,V,pressure,head,external,deep,sup,deepOut,supOut,perf,coll,p,dt});');
let observe = () => {};
const context = { exports: {}, auditHook: state => observe(state), Math };
vm.runInNewContext(generated, context, { filename: 'model-audit-memory.cjs' });
const { solve, defaults, scenarios, sanitize, modelVersion } = context.exports;

function measure(parameters, dt=.01, warmupCycles=12) {
  const p = sanitize(parameters);
  const out = { parameters:p, dt, minVolume:[Infinity,Infinity,Infinity,Infinity], minWindowVolume:[Infinity,Infinity,Infinity,Infinity], maxVolume:[-Infinity,-Infinity,-Infinity,-Infinity], minTransmural:[Infinity,Infinity,Infinity,Infinity], minWindowTransmural:[Infinity,Infinity,Infinity,Infinity], maxPhaseCycleDrift:0, windowStart:null, lastCycleStart:null, final:null, actualWindowOut:0 };
  let prevCycle = [];
  const cycleSteps = Math.round(p.period/dt);
  observe = s => {
    s.V.forEach((v,i) => {
      out.minVolume[i] = Math.min(out.minVolume[i],v);
      out.maxVolume[i] = Math.max(out.maxVolume[i],v);
      out.minTransmural[i] = Math.min(out.minTransmural[i],s.pressure[i]-s.external[i]);
      if(s.t>=p.period*warmupCycles){
        out.minWindowVolume[i] = Math.min(out.minWindowVolume[i],v);
        out.minWindowTransmural[i] = Math.min(out.minWindowTransmural[i],s.pressure[i]-s.external[i]);
      }
    });
    if (Math.abs(s.t-p.period*warmupCycles)<dt*.51) out.windowStart=[...s.V];
    if (Math.abs(s.t-p.period*(warmupCycles+1))<dt*.51) out.lastCycleStart=[...s.V];
    if(s.t>=p.period*warmupCycles && s.k<s.steps)out.actualWindowOut+=(s.deepOut+s.supOut+s.coll)*dt;
    if (s.t>=p.period*warmupCycles) {
      const idx = Math.round(s.t/dt)%cycleSteps;
      if (prevCycle[idx]) out.maxPhaseCycleDrift = Math.max(out.maxPhaseCycleDrift,...s.V.map((v,i)=>Math.abs(v-prevCycle[idx][i])));
      prevCycle[idx]=[...s.V];
    }
    if (s.k===s.steps) out.final=[...s.V];
  };
  let localSolve=solve;
  if(warmupCycles!==12){
    const localContext={exports:{},auditHook:state=>observe(state),Math};
    const altered=generated.replace('const warmup = p.period * 12,',`const warmup = p.period * ${warmupCycles},`);
    if(altered===generated)throw Error('No se encontró calentamiento para auditoría');
    vm.runInNewContext(altered,localContext);
    localSolve=localContext.exports.solve;
  }
  const sol = localSolve(p,dt);
  out.warmupCycles=warmupCycles;
  out.netReturn=sol.netReturn;
  out.refluxVolume=sol.refluxVolume;
  out.meanPressure=sol.meanPressure;
  out.peakPressure=sol.peakPressure;
  out.balanceError=sol.balanceError;
  out.sampledMinVolume=Math.min(...sol.samples.map(s=>s.volume));
  out.lastCycleDrift=out.final.map((v,i)=>v-out.lastCycleStart[i]);
  out.windowVolumeDrift=out.final.reduce((a,b)=>a+b,0)-out.windowStart.reduce((a,b)=>a+b,0);
  out.actualNetReturn=out.actualWindowOut/(p.period*2);
  out.finite=Object.values(sol).filter(v=>typeof v==='number').every(Number.isFinite)&&sol.samples.every(s=>Object.values(s).every(Number.isFinite));
  return out;
}

module.exports={measure,solve,defaults,scenarios,sanitize,modelVersion,hash};
if(require.main===module){
const corners=[];
for(const posture of [0,90])for(const pump of [0,1.6])for(const leak of [0,1])for(const obstruction of [1,8])for(const compression of [0,2.5])for(const perforator of [0,1.6])for(const collateral of [false,true])for(const period of [2,10]) corners.push(measure({posture,pump,leak,obstruction,compression,perforator,collateral,period}));
const nominal=scenarios.map(s=>({id:s.id,...measure({...defaults,...s.params})}));
let seed=20261106;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const interior=[];
for(let k=0;k<1500;k++)interior.push(measure({posture:90*random(),pump:1.6*random(),leak:random(),obstruction:1+7*random(),compression:2.5*random(),perforator:1.6*random(),collateral:random()>.5,period:2+Math.floor(random()*17)*.5}));
const all=[...corners,...interior];
const byMin=[...all].sort((a,b)=>Math.min(...a.minVolume)-Math.min(...b.minVolume));
const bySettling=[...all].sort((a,b)=>Math.max(...b.lastCycleDrift.map(Math.abs))-Math.max(...a.lastCycleDrift.map(Math.abs)));
const worst=byMin[0];
const sameAtFine=measure(worst.parameters,.005);
const worstSettling=bySettling[0];
const counts={cases:all.length,corners:corners.length,interior:interior.length,negativeVolume:all.filter(x=>Math.min(...x.minVolume)<0).length,negativeWindowVolume:all.filter(x=>Math.min(...x.minWindowVolume)<0).length,negativeTransmural:all.filter(x=>Math.min(...x.minTransmural)<0).length,lastCycleDriftOverPoint05:all.filter(x=>Math.max(...x.lastCycleDrift.map(Math.abs))>.05).length,nonFinite:all.filter(x=>!x.finite).length};
const report={modelVersion,sourceHash:hash,sourcePath:'src/labs/twin/model.ts',scope:'Auditoría numérica del modelo educativo. No validación clínica.',counts,nominal,worstVolumes:byMin.slice(0,12),worstSettling:bySettling.slice(0,6),worstAtHalfStep:sameAtFine};
const output=path.join(root,'docs/content/verification/model-domain-audit.json');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(report,null,2));
console.log(JSON.stringify({modelVersion,sourceHash:hash,counts,negativeNominal:nominal.filter(x=>Math.min(...x.minVolume)<0).map(x=>({id:x.id,min:x.minVolume})),worst,sameAtFine,worstSettling},null,2));
}
