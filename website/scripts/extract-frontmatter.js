#!/usr/bin/env node

/**
 * Script de Extração de Frontmatter
 * TASK_1.1.3: Extrair e Catalogar Frontmatter (REFATORADA)
 * Ricardo Lima - Nuxt Specialist
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONTENT_ROOT = '/home/neto/projects/matrix-protocol/website/content';

class FrontmatterExtractor {
    constructor() {
        this.catalog = {
            metadata: {
                extractedAt: new Date().toISOString(),
                totalFiles: 0,
                filesWithFrontmatter: 0,
                filesWithoutFrontmatter: 0,
                script: "extract-frontmatter.js",
                task: "TASK_1.1.3 - Catalogar Frontmatter para Descoberta Automática"
            },
            patterns: {
                essentialFields: {},  // title, description, icon, order
                standardFields: {},   // layout, sidebar, toc, navigation
                customFields: {},     // outros campos encontrados
                missingFields: []     // arquivos com campos faltantes
            },
            inconsistencies: [],
            fallbackCandidates: [],
            structuredData: []
        };
    }

    extractFrontmatter(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            
            if (!frontmatterMatch) {
                return null;
            }
            
            return yaml.load(frontmatterMatch[1]);
        } catch (error) {
            console.error(`Erro ao extrair frontmatter de ${filePath}:`, error.message);
            return null;
        }
    }

    analyzeField(fieldName, value, filePath) {
        const field = this.catalog.patterns.essentialFields[fieldName] || 
                     this.catalog.patterns.standardFields[fieldName] || 
                     this.catalog.patterns.customFields[fieldName];
        
        if (!field) {
            // Categorizar campo
            const category = this.categorizeField(fieldName);
            this.catalog.patterns[category][fieldName] = {
                count: 0,
                values: new Set(),
                examples: [],
                files: []
            };
        }
        
        const targetField = this.catalog.patterns.essentialFields[fieldName] || 
                           this.catalog.patterns.standardFields[fieldName] || 
                           this.catalog.patterns.customFields[fieldName];
        
        targetField.count++;
        targetField.values.add(value);
        targetField.files.push(filePath);
        
        if (targetField.examples.length < 5) {
            targetField.examples.push({ value, file: filePath });
        }
    }

    categorizeField(fieldName) {
        const essential = ['title', 'description', 'icon', 'order'];
        const standard = ['layout', 'sidebar', 'toc', 'navigation'];
        
        if (essential.includes(fieldName)) return 'essentialFields';
        if (standard.includes(fieldName)) return 'standardFields';
        return 'customFields';
    }

    identifyInconsistencies(frontmatter, filePath) {
        const issues = [];
        
        // Verificar campos essenciais faltantes
        const requiredFields = ['title', 'description'];
        requiredFields.forEach(field => {
            if (!frontmatter[field]) {
                issues.push({
                    type: 'missing_essential_field',
                    field,
                    file: filePath,
                    severity: 'high'
                });
            }
        });
        
        // Verificar inconsistências de formato
        if (frontmatter.icon && !frontmatter.icon.startsWith('i-')) {
            issues.push({
                type: 'invalid_icon_format',
                value: frontmatter.icon,
                file: filePath,
                severity: 'medium',
                expected: 'i-heroicons-*'
            });
        }
        
        // Verificar navigation boolean vs estrutura
        if (frontmatter.navigation && typeof frontmatter.navigation === 'object') {
            issues.push({
                type: 'complex_navigation_structure',
                value: frontmatter.navigation,
                file: filePath,
                severity: 'low',
                note: 'Estrutura de navegação complexa encontrada'
            });
        }
        
        return issues;
    }

    generateFallbacks(filePath, frontmatter) {
        const relativePath = path.relative(CONTENT_ROOT, filePath);
        const pathSegments = relativePath.split('/');
        const fileName = path.basename(filePath, '.md');
        
        const fallback = {
            file: relativePath,
            current: frontmatter || {},
            fallbacks: {}
        };
        
        // Fallback para title
        if (!frontmatter?.title) {
            if (fileName === 'index') {
                // Usar nome da pasta para index.md
                const folderName = pathSegments[pathSegments.length - 2];
                fallback.fallbacks.title = this.formatFolderName(folderName);
            } else {
                fallback.fallbacks.title = this.formatFileName(fileName);
            }
        }
        
        // Fallback para icon
        if (!frontmatter?.icon) {
            fallback.fallbacks.icon = this.suggestIcon(pathSegments);
        }
        
        // Fallback para description
        if (!frontmatter?.description) {
            fallback.fallbacks.description = `Documentação para ${fallback.fallbacks.title || frontmatter?.title}`;
        }
        
        // Fallback para order (alfabética)
        if (!frontmatter?.order) {
            fallback.fallbacks.order = fileName === 'index' ? 0 : fileName.charCodeAt(0);
        }
        
        return fallback;
    }

    formatFolderName(folderName) {
        return folderName
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    formatFileName(fileName) {
        return fileName
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    suggestIcon(pathSegments) {
        // Mapa baseado na estrutura real descoberta
        const iconMap = {
            'quickstart': 'i-heroicons-rocket-launch',
            'manual': 'i-heroicons-book-open',
            'examples': 'i-heroicons-rectangle-stack',
            'frameworks': 'i-heroicons-cube',
            'templates': 'i-heroicons-document-duplicate',
            'knowledge': 'i-heroicons-academic-cap',
            'structured': 'i-heroicons-folder',
            'unstructured': 'i-heroicons-folder-open',
            'business-rules': 'i-heroicons-briefcase',
            'technical-patterns': 'i-heroicons-command-line',
            'procedures': 'i-heroicons-clipboard-document-list',
            'tools': 'i-heroicons-wrench-screwdriver',
            'reference': 'i-heroicons-bookmark',
            'glossary': 'i-heroicons-book-open',
            'implementation': 'i-heroicons-cog-6-tooth',
            'integration': 'i-heroicons-puzzle-piece',
            'mef': 'i-heroicons-cube',
            'moc': 'i-heroicons-building-library',
            'mal': 'i-heroicons-scale',
            'oif': 'i-heroicons-cpu-chip',
            'zof': 'i-heroicons-bolt',
            'mep': 'i-heroicons-light-bulb',
            'protocol': 'i-heroicons-globe-alt'
        };
        
        // Buscar correspondência nos segmentos do caminho
        for (const segment of pathSegments.reverse()) {
            if (iconMap[segment]) {
                return iconMap[segment];
            }
        }
        
        return 'i-heroicons-document-text'; // fallback padrão
    }

    scanDirectory(dirPath) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            
            if (entry.isDirectory()) {
                this.scanDirectory(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                this.processMarkdownFile(fullPath);
            }
        }
    }

    processMarkdownFile(filePath) {
        this.catalog.metadata.totalFiles++;
        
        const frontmatter = this.extractFrontmatter(filePath);
        
        if (!frontmatter) {
            this.catalog.metadata.filesWithoutFrontmatter++;
            this.catalog.patterns.missingFields.push({
                file: path.relative(CONTENT_ROOT, filePath),
                reason: 'no_frontmatter_block'
            });
        } else {
            this.catalog.metadata.filesWithFrontmatter++;
            
            // Analisar cada campo
            Object.entries(frontmatter).forEach(([key, value]) => {
                this.analyzeField(key, value, path.relative(CONTENT_ROOT, filePath));
            });
            
            // Identificar inconsistências
            const issues = this.identifyInconsistencies(frontmatter, path.relative(CONTENT_ROOT, filePath));
            this.catalog.inconsistencies.push(...issues);
        }
        
        // Gerar fallbacks
        const fallback = this.generateFallbacks(filePath, frontmatter);
        this.catalog.fallbackCandidates.push(fallback);
        
        // Estruturar dados para navegação
        this.catalog.structuredData.push({
            file: path.relative(CONTENT_ROOT, filePath),
            frontmatter: frontmatter || {},
            pathSegments: path.relative(CONTENT_ROOT, filePath).split('/'),
            isIndex: path.basename(filePath) === 'index.md',
            depth: path.relative(CONTENT_ROOT, filePath).split('/').length - 1
        });
    }

    finalize() {
        // Converter Sets para Arrays para serialização JSON
        ['essentialFields', 'standardFields', 'customFields'].forEach(category => {
            Object.values(this.catalog.patterns[category]).forEach(field => {
                field.values = Array.from(field.values);
            });
        });
        
        // Estatísticas gerais
        this.catalog.metadata.coverage = {
            title: this.catalog.patterns.essentialFields.title?.count || 0,
            description: this.catalog.patterns.essentialFields.description?.count || 0,
            icon: this.catalog.patterns.essentialFields.icon?.count || 0,
            order: this.catalog.patterns.essentialFields.order?.count || 0,
            navigation: this.catalog.patterns.standardFields.navigation?.count || 0
        };
        
        // Organizar por profundidade
        this.catalog.byDepth = {};
        this.catalog.structuredData.forEach(item => {
            if (!this.catalog.byDepth[item.depth]) {
                this.catalog.byDepth[item.depth] = [];
            }
            this.catalog.byDepth[item.depth].push(item);
        });
    }

    run() {
        console.log('🔍 INICIANDO EXTRAÇÃO DE FRONTMATTER...');
        console.log(`📂 Base: ${CONTENT_ROOT}`);
        
        this.scanDirectory(CONTENT_ROOT);
        this.finalize();
        
        // Salvar catálogo
        const outputPath = '/home/neto/projects/matrix-protocol/website/docs/dynamic-navigation/frontmatter-catalog.json';
        fs.writeFileSync(outputPath, JSON.stringify(this.catalog, null, 2));
        
        console.log('\n📊 RESULTADOS:');
        console.log(`├─ Total de arquivos MD: ${this.catalog.metadata.totalFiles}`);
        console.log(`├─ Com frontmatter: ${this.catalog.metadata.filesWithFrontmatter}`);
        console.log(`├─ Sem frontmatter: ${this.catalog.metadata.filesWithoutFrontmatter}`);
        console.log(`├─ Inconsistências: ${this.catalog.inconsistencies.length}`);
        console.log(`└─ Salvos fallbacks para: ${this.catalog.fallbackCandidates.length} arquivos`);
        
        console.log('\n🎯 CAMPOS ESSENCIAIS:');
        Object.entries(this.catalog.metadata.coverage).forEach(([field, count]) => {
            const percentage = ((count / this.catalog.metadata.totalFiles) * 100).toFixed(1);
            console.log(`├─ ${field}: ${count}/${this.catalog.metadata.totalFiles} (${percentage}%)`);
        });
        
        console.log(`\n💾 Catálogo salvo em: ${outputPath}`);
        
        return this.catalog;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    try {
        const extractor = new FrontmatterExtractor();
        extractor.run();
    } catch (error) {
        console.error('❌ Erro na execução:', error);
        process.exit(1);
    }
}

module.exports = FrontmatterExtractor;