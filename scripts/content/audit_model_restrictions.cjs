const {measure,defaults,scenarios,modelVersion,hash}=require('./audit_model_domain.cjs');
const fs=require('node:fs');
const path=require('node:path');
const caps=[];
for(const cap of [2,2.2,2.3,2.4]){
  const runs=[];
  for(const posture of [0,90])for(const pump of [0,1.6])for(const leak of [0,.02,1])for(const obstruction of [1,8])for(const compression of [0,cap])for(const perforator of [0,1.6])for(const collateral of [false,true])for(const period of [2,10])runs.push(measure({posture,pump,leak,obstruction,compression,perforator,collateral,period}));
  const worst=[...runs].sort((a,b)=>Math.min(...a.minVolume)-Math.min(...b.minVolume))[0];
  caps.push({cap,cases:runs.length,negativeVolume:runs.filter(x=>Math.min(...x.minVolume)<0).length,minimum:Math.min(...worst.minVolume),worstParameters:worst.parameters});
}
const focused=[];
for(const compression of [2,2.1,2.2,2.3,2.4,2.5])for(const posture of [0,5,10,20])for(const pump of [.8,1.2,1.6])for(const leak of [0,.005,.02])for(const perforator of [.8,1.2,1.6])focused.push(measure({...defaults,compression,posture,pump,leak,perforator,obstruction:1,collateral:true,period:10}));
const focusSummary=[2,2.1,2.2,2.3,2.4,2.5].map(cap=>({compression:cap,cases:focused.filter(x=>x.parameters.compression===cap).length,negativeVolume:focused.filter(x=>x.parameters.compression===cap&&Math.min(...x.minVolume)<0).length,minVolume:Math.min(...focused.filter(x=>x.parameters.compression===cap).flatMap(x=>x.minVolume))}));
const longRuns=[];
for(const id of ['TW01','TW02','TW09','TW11'])for(const cycles of [12,60,120,300]){
 const s=scenarios.find(x=>x.id===id);const m=measure({...defaults,...s.params},.01,cycles);
 longRuns.push({id,cycles,netReturn:m.netReturn,actualNetReturn:m.actualNetReturn,windowVolumeDrift:m.windowVolumeDrift,lastCycleDrift:m.lastCycleDrift,minVolume:m.minVolume,minWindowVolume:m.minWindowVolume});
}
const extreme={posture:90,pump:1.6,leak:0,obstruction:8,compression:0,perforator:0,collateral:false,period:10};
for(const cycles of [12,60,120,300]){const m=measure(extreme,.01,cycles);longRuns.push({id:'EXTREME_OBSTRUCTION',cycles,netReturn:m.netReturn,actualNetReturn:m.actualNetReturn,windowVolumeDrift:m.windowVolumeDrift,lastCycleDrift:m.lastCycleDrift,minVolume:m.minVolume,minWindowVolume:m.minWindowVolume});}
const report={modelVersion,sourceHash:hash,caps,focused:focusSummary,longRuns};
fs.writeFileSync(path.resolve(__dirname,'../../docs/content/verification/model-domain-restrictions.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
