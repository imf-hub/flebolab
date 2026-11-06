/* Auditoría del archivo real, sin instrumentar ni alterar el código de aplicación. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const ts=require('typescript');
const root=path.resolve(__dirname,'../..');
const sourceFlag=process.argv.find(x=>x.startsWith('--source='));
const sourcePath=path.resolve(root,sourceFlag?sourceFlag.slice(9):'src/labs/twin/model.ts');
const source=fs.readFileSync(sourcePath,'utf8');
const sourceHash=crypto.createHash('sha256').update(source).digest('hex');
const code=ts.transpile(source,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS});
const context={exports:{},Math};vm.runInNewContext(code,context);
const {solve,sanitize,defaults,scenarios,modelVersion,convergenceTolerance}=context.exports;
const output=path.join(root,'docs/content/verification');
fs.writeFileSync(path.join(output,'model-current.audit.ts'),source);
function check(p,step=.01){
 const s=solve(p,step);
 const numeric=Object.values(s).filter(x=>typeof x==='number');
 return {parameters:s.parameters,step,finite:numeric.every(Number.isFinite)&&s.samples.every(x=>Object.values(x).every(Number.isFinite)),minimumVolume:s.minimumVolume,converged:s.converged,warmupCycles:s.warmupCycles,warmupTime:s.warmupCycles*s.period,cycleResidual:s.cycleResidual,netReturn:s.netReturn,returnError:Math.abs(s.netReturn-.7),balanceError:s.balanceError,meanPressure:s.meanPressure,peakPressure:s.peakPressure,refluxVolume:s.refluxVolume,firstSample:s.samples[0],lastSample:s.samples.at(-1)};
}
const corners=[];
for(const posture of [0,90])for(const pump of [0,1.6])for(const leak of [0,.02,1])for(const obstruction of [1,8])for(const compression of [0,1.5])for(const perforator of [0,1.6])for(const collateral of [false,true])for(const period of [2,10])corners.push(check({posture,pump,leak,obstruction,compression,perforator,collateral,period}));
let seed=11062026;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const interior=[];
for(let k=0;k<1000;k++)interior.push(check({posture:90*random(),pump:1.6*random(),leak:random(),obstruction:1+7*random(),compression:1.5*random(),perforator:1.6*random(),collateral:random()>.5,period:2+Math.floor(random()*17)*.5}));
const nominal=scenarios.map(s=>({id:s.id,...check({...defaults,...s.params})}));
const all=[...corners,...interior];
const byVolume=[...all].sort((a,b)=>a.minimumVolume-b.minimumVolume);
const byReturn=[...all].sort((a,b)=>b.returnError-a.returnError);
const byResidual=[...all].sort((a,b)=>b.cycleResidual-a.cycleResidual);
const byTime=[...all].sort((a,b)=>b.warmupTime-a.warmupTime);
const fine=[byVolume[0],byReturn[0],byResidual[0],byTime[0]].map(s=>({normal:s,fine:check(s.parameters,.005)}));
const stepGuard=[0,-1,Infinity,NaN,.00001,.5].map(step=>({requested:String(step),...check(defaults,step)}));
const report={modelVersion,sourceHash,convergenceTolerance,corners:corners.length,interior:interior.length,seed:11062026,counts:{nonFinite:all.filter(x=>!x.finite).length,negativeVolume:all.filter(x=>x.minimumVolume<=0).length,notConverged:all.filter(x=>!x.converged).length,returnErrorOver001:all.filter(x=>x.returnError>.001).length},maximumBalanceError:Math.max(...all.map(x=>x.balanceError)),returnRange:[Math.min(...all.map(x=>x.netReturn)),Math.max(...all.map(x=>x.netReturn))],minimumVolume:byVolume[0],maximumReturnError:byReturn[0],maximumResidual:byResidual[0],maximumWarmupTime:byTime[0],fine,nominal,stepGuard};
fs.writeFileSync(path.join(output,'model-current-domain-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({modelVersion,sourceHash,corners:report.corners,interior:report.interior,counts:report.counts,maximumBalanceError:report.maximumBalanceError,returnRange:report.returnRange,minimumVolume:report.minimumVolume.minimumVolume,maximumReturnError:report.maximumReturnError.returnError,maximumCycleResidual:report.maximumResidual.cycleResidual,maximumWarmupTime:report.maximumWarmupTime.warmupTime,allNominalConverged:nominal.every(x=>x.converged),allInvalidStepsFinite:stepGuard.every(x=>x.finite)},null,2));
