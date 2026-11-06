import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const read=n=>JSON.parse(fs.readFileSync(`src/data/${n}.json`,'utf8'));
const dus=read('dus'),vision=read('vision'),assets=read('assets'),waterloo=read('waterloo');
const exists=p=>{assert(p.startsWith('/media/'),`Ruta externa inesperada ${p}`);assert(fs.existsSync(path.join('public',p)),`Medio faltante ${p}`)};
for(const list of [dus,vision,assets])assert.equal(new Set(list.map(x=>x.id)).size,list.length,'IDs duplicados');
assert.equal(dus.length,72);assert.equal(new Set(dus.map(c=>c.participantId)).size,72);assert.equal(vision.length,96);assert.equal(new Set(vision.map(x=>x.sourceCaseId)).size,71);assert.equal(vision.filter(x=>x.thermal).length,12);
for(const site of ['CFV','GS','FV','PV'])assert.equal(dus.filter(c=>c.site===site).length,18);
let frames=0;
for(const c of dus){exists(c.video);exists(c.poster);assert(c.timingVerified);assert.equal(c.calibration,null);assert.equal(c.indexedFrames,true);let index=0;for(const a of c.frameAtlases){exists(a.src);assert.equal(a.startFrame,index);assert(a.count<=a.rows*a.columns);index+=a.count}assert.equal(index,c.frameCount);assert(Math.abs(c.frameCount/c.fps-c.duration)<.001);frames+=c.frameCount;assert(c.sourceUrl&&c.attribution&&c.license)}
for(const p of vision){exists(p.image);exists(p.thumbnail);if(p.thermal)exists(p.thermal);assert(p.width>0&&p.height>0);assert(p.attribution&&p.originalLabels)}
for(const a of assets){exists(a.path);assert(a.sourceUrl&&a.attribution&&a.license)}
exists(waterloo.videoPath);exists(waterloo.posterPath);exists(waterloo.figurePath);assert.equal(waterloo.quantitativeDataAvailable,false);
for(let i=1;i<=18;i++)exists(`/media/plates/pl${String(i).padStart(2,'0')}.svg`);
for(let i=1;i<=6;i++)exists(`/media/animations/an${String(i).padStart(2,'0')}.svg`);
console.log(JSON.stringify({status:'passed',cines:dus.length,participants:72,frames,photos:vision.length,sourceFolders:71,thermalPairs:12,anatomicalAssets:assets.length,plates:18,animations:6},null,2));
