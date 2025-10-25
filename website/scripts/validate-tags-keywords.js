#!/usr/bin/env node

/**
 * Tags and Keywords Validation Script
 * Matrix Protocol Documentation
 * 
 * Validates that all documentation files have appropriate tags and keywords
 * according to the established taxonomy strategy.
 */

import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONTENT_DIR = path.join(__dirname, '../content');
const REQUIRED_KEYWORDS_MIN = 6;
const REQUIRED_KEYWORDS_MAX = 12;
const REQUIRED_TAGS_MIN = 3;
const REQUIRED_TAGS_MAX = 8;

// Tag taxonomy rules
const TAG_TAXONOMY = {
  'manual/tools': {
    required: ['manual', 'tools'],
    optional: ['validation', 'quality', 'automation', 'dod', 'feedback', 'explainability', 'uki', 'templates', 'moc', 'generation', 'audit', 'assessment']
  },
  'manual/templates': {
    required: ['manual', 'templates'],
    optional: ['startup', 'scaleup', 'enterprise', 'corporation', 'unified', 'basic', 'implementation', 'phases', 'uki']
  },
  'examples': {
    required: ['examples'],
    optional: ['knowledge', 'structured', 'unstructured', 'pilots', 'conceptual', 'business-rules', 'technical-patterns', 'procedures', 'mef', 'comparison', 'moc', 'organizational', 'yaml']
  },
  'frameworks': {
    required: ['frameworks'],
    optional: ['mef', 'zof', 'oif', 'moc', 'mal', 'core']
  },
  'implementation': {
    required: ['implementation'],
    optional: ['quickstart', 'assessment', 'planning', 'manual']
  }
};

// Files that MUST have tags (by path pattern)
const MUST_HAVE_TAGS = [
  /manual\/tools\//,
  /manual\/templates\//,
  /examples\//,
  /quickstart\//,
  /manual\/assessment/,
  /manual\/planning/
];

// Files that MAY have only keywords (by path pattern)
const MAY_KEYWORDS_ONLY = [
  /frameworks\/(mef|zof|oif|moc|mal)\.md$/,
  /glossary\.md$/,
  /protocol\/index\.md$/,
  /mep\/index\.md$/
];

function getAllMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  try {
    return load(match[1]);
  } catch (error) {
    return null;
  }
}

function getRelativePath(filePath) {
  return path.relative(CONTENT_DIR, filePath);
}

function determineCategoryFromPath(relativePath) {
  if (relativePath.includes('manual/tools/')) return 'manual/tools';
  if (relativePath.includes('manual/templates/')) return 'manual/templates';
  if (relativePath.includes('examples/')) return 'examples';
  if (relativePath.includes('frameworks/')) return 'frameworks';
  if (relativePath.includes('quickstart/') || relativePath.includes('assessment') || relativePath.includes('planning')) return 'implementation';
  return 'other';
}

function shouldHaveTags(relativePath) {
  return MUST_HAVE_TAGS.some(pattern => pattern.test(relativePath));
}

function mayHaveKeywordsOnly(relativePath) {
  return MAY_KEYWORDS_ONLY.some(pattern => pattern.test(relativePath));
}

function validateKeywords(keywords, relativePath) {
  const issues = [];
  
  if (!keywords || !Array.isArray(keywords)) {
    issues.push('Missing keywords array');
    return issues;
  }
  
  if (keywords.length < REQUIRED_KEYWORDS_MIN) {
    issues.push(`Too few keywords (${keywords.length}/${REQUIRED_KEYWORDS_MIN} minimum)`);
  }
  
  if (keywords.length > REQUIRED_KEYWORDS_MAX) {
    issues.push(`Too many keywords (${keywords.length}/${REQUIRED_KEYWORDS_MAX} maximum)`);
  }
  
  // Check for Matrix Protocol mention
  if (!keywords.some(k => k.toLowerCase().includes('matrix protocol'))) {
    issues.push('Missing "Matrix Protocol" keyword');
  }
  
  // Check for generic keywords
  const genericKeywords = ['example', 'guide', 'documentation', 'framework', 'tool', 'template'];
  const tooGeneric = keywords.filter(k => genericKeywords.includes(k.toLowerCase()));
  if (tooGeneric.length > 2) {
    issues.push(`Too many generic keywords: ${tooGeneric.join(', ')}`);
  }
  
  return issues;
}

function validateTags(tags, relativePath) {
  const issues = [];
  const category = determineCategoryFromPath(relativePath);
  const rules = TAG_TAXONOMY[category];
  
  if (!tags || !Array.isArray(tags)) {
    if (shouldHaveTags(relativePath)) {
      issues.push('Missing required tags array');
    }
    return issues;
  }
  
  if (tags.length < REQUIRED_TAGS_MIN) {
    issues.push(`Too few tags (${tags.length}/${REQUIRED_TAGS_MIN} minimum)`);
  }
  
  if (tags.length > REQUIRED_TAGS_MAX) {
    issues.push(`Too many tags (${tags.length}/${REQUIRED_TAGS_MAX} maximum)`);
  }
  
  // Check taxonomy compliance
  if (rules) {
    const missingRequired = rules.required.filter(req => !tags.includes(req));
    if (missingRequired.length > 0) {
      issues.push(`Missing required tags for ${category}: ${missingRequired.join(', ')}`);
    }
    
    const invalidTags = tags.filter(tag => 
      !rules.required.includes(tag) && !rules.optional.includes(tag)
    );
    if (invalidTags.length > 0) {
      issues.push(`Invalid tags for ${category}: ${invalidTags.join(', ')}`);
    }
  }
  
  return issues;
}

function validateFile(filePath) {
  const relativePath = getRelativePath(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);
  
  if (!frontmatter) {
    return {
      file: relativePath,
      issues: ['No frontmatter found']
    };
  }
  
  const issues = [];
  
  // Validate keywords (required for all files)
  const keywordIssues = validateKeywords(frontmatter.keywords, relativePath);
  issues.push(...keywordIssues.map(issue => `Keywords: ${issue}`));
  
  // Validate tags (conditional)
  if (shouldHaveTags(relativePath) || frontmatter.tags) {
    const tagIssues = validateTags(frontmatter.tags, relativePath);
    issues.push(...tagIssues.map(issue => `Tags: ${issue}`));
  }
  
  return {
    file: relativePath,
    issues: issues,
    hasKeywords: !!frontmatter.keywords,
    hasTags: !!frontmatter.tags,
    keywordCount: frontmatter.keywords?.length || 0,
    tagCount: frontmatter.tags?.length || 0
  };
}

function generateReport(results) {
  const total = results.length;
  const withIssues = results.filter(r => r.issues.length > 0);
  const withKeywords = results.filter(r => r.hasKeywords);
  const withTags = results.filter(r => r.hasTags);
  
  console.log('\n🏷️  Tags and Keywords Validation Report');
  console.log('==========================================');
  console.log(`📊 Total files: ${total}`);
  console.log(`✅ Files with keywords: ${withKeywords.length} (${Math.round(withKeywords.length/total*100)}%)`);
  console.log(`🏷️  Files with tags: ${withTags.length} (${Math.round(withTags.length/total*100)}%)`);
  console.log(`❌ Files with issues: ${withIssues.length} (${Math.round(withIssues.length/total*100)}%)`);
  
  if (withIssues.length > 0) {
    console.log('\n❌ Files with Issues:');
    console.log('====================');
    
    withIssues.forEach(result => {
      console.log(`\n📄 ${result.file}`);
      console.log(`   Keywords: ${result.keywordCount} | Tags: ${result.tagCount}`);
      result.issues.forEach(issue => {
        console.log(`   ❌ ${issue}`);
      });
    });
  }
  
  // Category breakdown
  console.log('\n📊 Category Breakdown:');
  console.log('======================');
  
  const categories = {};
  results.forEach(r => {
    const category = determineCategoryFromPath(r.file);
    if (!categories[category]) {
      categories[category] = { total: 0, withTags: 0, withIssues: 0 };
    }
    categories[category].total++;
    if (r.hasTags) categories[category].withTags++;
    if (r.issues.length > 0) categories[category].withIssues++;
  });
  
  Object.entries(categories).forEach(([category, stats]) => {
    console.log(`${category.padEnd(20)} | Total: ${stats.total.toString().padStart(3)} | Tags: ${stats.withTags.toString().padStart(3)} | Issues: ${stats.withIssues.toString().padStart(3)}`);
  });
  
  return withIssues.length === 0;
}

function main() {
  console.log('🔍 Scanning for markdown files...');
  
  const files = getAllMarkdownFiles(CONTENT_DIR);
  console.log(`📄 Found ${files.length} markdown files`);
  
  console.log('🏷️  Validating tags and keywords...');
  const results = files.map(validateFile);
  
  const success = generateReport(results);
  
  if (success) {
    console.log('\n✅ All files pass validation!');
    process.exit(0);
  } else {
    console.log('\n❌ Validation failed. Please fix the issues above.');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  validateFile,
  getAllMarkdownFiles,
  generateReport
};