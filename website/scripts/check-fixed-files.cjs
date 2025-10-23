const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, '../docs/dynamic-navigation/02-execution/slug-link-reports/slug-link-latest.json');

function main() {
  if (!fs.existsSync(reportPath)) {
    console.error('Report não encontrado:', reportPath);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const results = Array.isArray(report.results) ? report.results : [];

  console.log('=== VERIFICAÇÃO DOS LINKS CORRIGIDOS ===');

  const fixedFiles = new Set([
    'pt/docs/examples/knowledge/unstructured/confluence-payment-flow.md',
    'pt/docs/implementation.md',
    'pt/docs/manual/templates/index.md',
    'pt/docs/quickstart/index.md',
  ]);

  let foundIssues = false;

  // Index results by file for quick lookup
  const index = new Map(results.map(r => [r.file, r]));

  for (const file of fixedFiles) {
    const fileData = index.get(file);
    const broken = fileData?.linkAnalysis?.broken || [];
    if (broken.length > 0) {
      console.log(`❌ ${file} ainda tem ${broken.length} links quebrados:`);
      for (const link of broken) {
        console.log(`   - ${link.href} -> ${link.resolved}`);
      }
      foundIssues = true;
    } else {
      console.log(`✅ ${file} - sem links quebrados`);
    }
  }

  if (!foundIssues) {
    console.log('\n🎉 Todos os links corrigidos estão funcionando!');
  } else {
    console.log('\n⚠️ Ainda existem alguns links quebrados nos arquivos corrigidos.');
  }
}

main();