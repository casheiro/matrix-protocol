const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, '../docs/dynamic-navigation/02-execution/slug-link-reports/slug-link-latest.json');

function main() {
  const raw = fs.readFileSync(reportPath, 'utf-8');
  const report = JSON.parse(raw);
  const results = report.results || [];

  const brokenEn = results
    .filter(r => typeof r.file === 'string' && r.file.startsWith('en/docs/'))
    .map(r => ({
      file: r.file,
      broken: (r.linkAnalysis && Array.isArray(r.linkAnalysis.broken)) ? r.linkAnalysis.broken : [],
      nonConform: (r.linkAnalysis && Array.isArray(r.linkAnalysis.nonConformPaths)) ? r.linkAnalysis.nonConformPaths : [],
      linkCount: r.linkAnalysis ? r.linkAnalysis.linkCount : 0,
    }))
    .filter(r => r.broken.length > 0);

  console.log(`Found ${brokenEn.length} en/docs files with broken links`);
  for (const r of brokenEn) {
    console.log(`\n# ${r.file}`);
    for (const b of r.broken) {
      console.log(`- broken: href=${b.href} resolved=${b.resolved ?? ''}`);
    }
  }
}

main();