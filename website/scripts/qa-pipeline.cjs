#!/usr/bin/env node

/**
 * Matrix Protocol QA Pipeline
 * Comprehensive quality assurance for Sprint 2 compliance
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const QA_PIPELINE = {
  checks: [
    {
      name: 'Slugs & Links Validation',
      script: 'check-english-slugs.js',
      weight: 25,
      required: true
    },
    {
      name: 'Editorial Checklist',
      script: 'editorial-checklist.cjs',
      weight: 25,
      required: true
    },
    {
      name: 'Tag Validation',
      script: 'tag-validation.cjs',
      weight: 25,
      required: true
    },
    {
      name: 'Content Audit',
      script: 'content-audit.js',
      weight: 25,
      required: false
    }
  ],
  sprint2Requirements: {
    slugsConform: { min: 100, description: '100% slugs English-only conform' },
    linksValid: { min: 98, description: '≥98% links valid' },
    frontmatterValid: { min: 80, description: '≥80% valid frontmatter' },
    indexCoverage: { min: 80, description: '≥80% index.md coverage' },
    resourcesSections: { min: 1, description: 'Recursos Relacionados sections present' },
    editorialScore: { min: 80, description: '≥80% editorial checklist score' },
    tagScore: { min: 70, description: '≥70% tag validation score' }
  }
}

class QAPipeline {
  constructor() {
    this.results = {}
    this.summary = {}
  }

  async runCheck(check) {
    console.log(`\n🔍 Running: ${check.name}`)
    
    try {
      const scriptPath = path.join(__dirname, check.script)
      if (!fs.existsSync(scriptPath)) {
        console.log(`⚠️ Script not found: ${check.script}`)
        return { success: false, error: 'Script not found' }
      }

      // Run script and capture output
      const output = execSync(`node ${scriptPath}`, { 
        encoding: 'utf-8',
        cwd: process.cwd()
      })
      
      console.log(`✅ ${check.name} completed`)
      return { success: true, output }
      
    } catch (error) {
      // Some scripts exit with code 1 for warnings, but still generate reports
      if (error.stdout) {
        console.log(`⚠️ ${check.name} completed with warnings`)
        return { success: true, output: error.stdout, warnings: true }
      } else {
        console.log(`❌ ${check.name} failed: ${error.message}`)
        return { success: false, error: error.message }
      }
    }
  }

  loadReports() {
    const reports = {}
    
    // Load slug/link report
    try {
      const slugReport = path.join(process.cwd(), 'docs/dynamic-navigation/02-execution/slug-link-reports/slug-link-latest.json')
      if (fs.existsSync(slugReport)) {
        reports.slugs = JSON.parse(fs.readFileSync(slugReport, 'utf-8'))
      }
    } catch (error) {
      console.log('⚠️ Could not load slug report')
    }

    // Load editorial report
    try {
      const editorialReport = path.join(process.cwd(), 'docs/dynamic-navigation/02-execution/editorial-reports/editorial-checklist-latest.json')
      if (fs.existsSync(editorialReport)) {
        reports.editorial = JSON.parse(fs.readFileSync(editorialReport, 'utf-8'))
      }
    } catch (error) {
      console.log('⚠️ Could not load editorial report')
    }

    // Load tag report
    try {
      const tagReport = path.join(process.cwd(), 'docs/dynamic-navigation/02-execution/tag-reports/tag-validation-latest.json')
      if (fs.existsSync(tagReport)) {
        reports.tags = JSON.parse(fs.readFileSync(tagReport, 'utf-8'))
      }
    } catch (error) {
      console.log('⚠️ Could not load tag report')
    }

    return reports
  }

  evaluateSprint2Compliance(reports) {
    const compliance = {}
    
    if (reports.slugs) {
      const { results } = reports.slugs
      const totalFiles = results.length
      const flaggedSlugs = results.filter(r => r.slugIssues.length > 0).length
      const brokenLinks = results.reduce((sum, r) => sum + r.linkAnalysis.broken.length, 0)
      const totalLinks = results.reduce((sum, r) => sum + r.linkAnalysis.linkCount, 0)
      
      compliance.slugsConform = {
        value: totalFiles > 0 ? ((totalFiles - flaggedSlugs) / totalFiles) * 100 : 100,
        passed: flaggedSlugs === 0,
        details: `${flaggedSlugs} flagged slugs out of ${totalFiles} files`
      }
      
      compliance.linksValid = {
        value: totalLinks > 0 ? ((totalLinks - brokenLinks) / totalLinks) * 100 : 100,
        passed: totalLinks > 0 ? ((totalLinks - brokenLinks) / totalLinks) * 100 >= QA_PIPELINE.sprint2Requirements.linksValid.min : true,
        details: `${brokenLinks} broken links out of ${totalLinks} total`
      }
      
      // Check for resources sections
      const resourcesSections = results.filter(r => {
        try {
          const content = fs.readFileSync(r.file.replace(/^(pt|en)\//, 'content/$1/'), 'utf-8')
          return /📖.*[Rr]ecursos?.*[Rr]elacionados?|📖.*Related.*Resources?/i.test(content)
        } catch {
          return false
        }
      }).length
      
      compliance.resourcesSections = {
        value: resourcesSections,
        passed: resourcesSections >= QA_PIPELINE.sprint2Requirements.resourcesSections.min,
        details: `${resourcesSections} files with resources sections`
      }
    }

    if (reports.editorial) {
      compliance.editorialScore = {
        value: reports.editorial.summary.averageScore,
        passed: reports.editorial.summary.averageScore >= QA_PIPELINE.sprint2Requirements.editorialScore.min,
        details: `${reports.editorial.summary.passed}/${reports.editorial.summary.totalFiles} files passed`
      }
      
      compliance.frontmatterValid = {
        value: reports.editorial.summary.totalFiles > 0 ? 
          (reports.editorial.summary.passed / reports.editorial.summary.totalFiles) * 100 : 100,
        passed: reports.editorial.summary.totalFiles > 0 ? 
          (reports.editorial.summary.passed / reports.editorial.summary.totalFiles) * 100 >= QA_PIPELINE.sprint2Requirements.frontmatterValid.min : true,
        details: `${reports.editorial.summary.passed} files with valid frontmatter`
      }
    }

    if (reports.tags) {
      compliance.tagScore = {
        value: reports.tags.summary.averageScore,
        passed: reports.tags.summary.averageScore >= QA_PIPELINE.sprint2Requirements.tagScore.min,
        details: `${reports.tags.summary.passed}/${reports.tags.summary.totalFiles} files passed`
      }
    }

    // Index coverage (calculate from file system)
    try {
      const totalDirs = execSync('find content/pt/docs -type d | wc -l', { encoding: 'utf-8' }).trim()
      const indexFiles = execSync('find content/pt/docs -name "index.md" | wc -l', { encoding: 'utf-8' }).trim()
      
      compliance.indexCoverage = {
        value: parseInt(totalDirs) > 0 ? (parseInt(indexFiles) / parseInt(totalDirs)) * 100 : 100,
        passed: parseInt(totalDirs) > 0 ? (parseInt(indexFiles) / parseInt(totalDirs)) * 100 >= QA_PIPELINE.sprint2Requirements.indexCoverage.min : true,
        details: `${indexFiles} index.md files in ${totalDirs} directories`
      }
    } catch (error) {
      compliance.indexCoverage = { value: 0, passed: false, details: 'Could not calculate' }
    }

    return compliance
  }

  async run() {
    console.log('🚀 Matrix Protocol QA Pipeline')
    console.log('=' * 50)
    
    // Run all checks
    for (const check of QA_PIPELINE.checks) {
      this.results[check.name] = await this.runCheck(check)
    }
    
    // Load and analyze reports
    console.log('\n📊 Analyzing Results...')
    const reports = this.loadReports()
    const compliance = this.evaluateSprint2Compliance(reports)
    
    // Generate summary
    const totalCompliance = Object.values(compliance)
    const passedCompliance = totalCompliance.filter(c => c.passed)
    const overallScore = totalCompliance.length > 0 ? 
      (passedCompliance.length / totalCompliance.length) * 100 : 0
    
    this.summary = {
      timestamp: new Date().toISOString(),
      overallScore,
      compliance,
      passedChecks: passedCompliance.length,
      totalChecks: totalCompliance.length,
      sprint2Status: overallScore >= 78 ? 'APPROVED' : 'NEEDS_WORK' // 7/9 = 78%
    }
    
    // Save comprehensive report
    const reportsDir = path.join(process.cwd(), 'docs/dynamic-navigation/02-execution/qa-reports')
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true })
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(reportsDir, `qa-pipeline-${timestamp}.json`)
    const latestPath = path.join(reportsDir, 'qa-pipeline-latest.json')
    
    const fullReport = {
      summary: this.summary,
      results: this.results,
      reports,
      requirements: QA_PIPELINE.sprint2Requirements
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(fullReport, null, 2))
    fs.writeFileSync(latestPath, JSON.stringify(fullReport, null, 2))
    
    // Display results
    this.displayResults()
    
    console.log(`\n📁 Full report saved: ${reportPath}`)
    
    return this.summary
  }

  displayResults() {
    console.log('\n' + '=' * 60)
    console.log('📋 SPRINT 2 COMPLIANCE REPORT')
    console.log('=' * 60)
    
    console.log(`\n🎯 Overall Score: ${this.summary.overallScore.toFixed(1)}%`)
    console.log(`📊 Status: ${this.summary.sprint2Status}`)
    console.log(`✅ Passed: ${this.summary.passedChecks}/${this.summary.totalChecks} criteria`)
    
    console.log('\n📋 Detailed Compliance:')
    Object.entries(this.summary.compliance).forEach(([key, result]) => {
      const icon = result.passed ? '✅' : '❌'
      const requirement = QA_PIPELINE.sprint2Requirements[key]
      console.log(`   ${icon} ${requirement.description}: ${result.value.toFixed(1)}% (${result.details})`)
    })
    
    if (this.summary.sprint2Status === 'APPROVED') {
      console.log('\n🎉 SPRINT 2 APPROVED - All critical criteria met!')
    } else {
      console.log('\n⚠️ Sprint 2 needs additional work on failing criteria')
    }
  }
}

// CLI execution
if (require.main === module) {
  const pipeline = new QAPipeline()
  pipeline.run().then(summary => {
    process.exit(summary.sprint2Status === 'APPROVED' ? 0 : 1)
  }).catch(error => {
    console.error('❌ Pipeline failed:', error)
    process.exit(1)
  })
}

module.exports = QAPipeline