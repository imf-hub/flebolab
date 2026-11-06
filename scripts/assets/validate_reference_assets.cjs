const fs = require('node:fs');
const path = require('node:path');
const validator = require('./.tools/node_modules/gltf-validator');

(async () => {
  const folder = path.resolve(__dirname, '../../public/media/anatomy');
  const reports = [];
  for (const name of fs.readdirSync(folder).filter(n => n.endsWith('.glb'))) {
    const report = await validator.validateBytes(new Uint8Array(fs.readFileSync(path.join(folder,name))), {
      uri: name, format: 'glb', maxIssues: 100, writeTimestamp: false,
    });
    reports.push(report);
    console.log(name, JSON.stringify({ errors: report.issues.numErrors, warnings: report.issues.numWarnings,
      infos: report.issues.numInfos, messages: report.issues.messages.slice(0, 3) }));
  }
  fs.writeFileSync(path.join(__dirname,'validation-report.json'), JSON.stringify(reports,null,2));
  if (reports.some(r=>r.issues.numErrors)) process.exitCode=1;
})().catch(e=>{ console.error(e); process.exitCode=1; });
