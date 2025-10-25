/**
 * TASK 1.2.1: Validation Rules for Content Metadata Schema
 * 
 * Additional validation logic beyond JSON Schema capabilities
 * for Matrix Protocol content standards.
 */

export const ValidationRules = {
  
  /**
   * Validate framework-specific requirements
   */
  validateFrameworkContent(frontmatter) {
    const errors = []
    const { framework, category, keywords = [] } = frontmatter
    
    // Framework-specific keyword requirements
    const frameworkKeywords = {
      'MEF': ['MEF', 'knowledge', 'embedding'],
      'ZOF': ['ZOF', 'workflow', 'orchestration'],
      'OIF': ['OIF', 'operator', 'intelligence'],
      'MOC': ['MOC', 'ontology', 'catalog'],
      'MAL': ['MAL', 'arbiter', 'layer'],
      'MEP': ['MEP', 'epistemic', 'principle']
    }
    
    if (framework && frameworkKeywords[framework]) {
      const requiredKeywords = frameworkKeywords[framework]
      const missingKeywords = requiredKeywords.filter(
        keyword => !keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
      )
      
      if (missingKeywords.length > 0) {
        errors.push(`Framework ${framework} content must include keywords: ${missingKeywords.join(', ')}`)
      }
    }
    
    // Category-framework compatibility
    const incompatibleCombinations = [
      { framework: 'MEP', category: 'templates' }, // MEP é conceitual, não tem templates
      { framework: 'MAL', category: 'quickstart' }  // MAL é avançado, não quickstart
    ]
    
    const incompatible = incompatibleCombinations.find(
      combo => combo.framework === framework && combo.category === category
    )
    
    if (incompatible) {
      errors.push(`Framework ${framework} is not compatible with category ${category}`)
    }
    
    return errors
  },

  /**
   * Validate navigation consistency
   */
  validateNavigation(frontmatter, filePath) {
    const errors = []
    const { navigation = {} } = frontmatter
    
    // Check if order is logical for directory depth
    if (navigation.order !== undefined) {
      const pathDepth = filePath.split('/').length - 1
      const expectedOrderRange = {
        1: [1, 99],     // Root level
        2: [100, 999],  // Category level  
        3: [1000, 9999] // Sub-category level
      }
      
      const range = expectedOrderRange[pathDepth]
      if (range && (navigation.order < range[0] || navigation.order > range[1])) {
        errors.push(`Navigation order ${navigation.order} inappropriate for depth ${pathDepth}. Expected: ${range[0]}-${range[1]}`)
      }
    }
    
    // Validate parent path exists in project structure
    if (navigation.parent) {
      // Este será implementado com dados reais da estrutura
      // Por agora, apenas validar formato
      if (!navigation.parent.startsWith('/')) {
        errors.push('Navigation parent must start with "/"')
      }
    }
    
    return errors
  },

  /**
   * Validate multilingual content requirements
   */
  validateMultilingual(frontmatter, filePath) {
    const errors = []
    const { content = {} } = frontmatter
    
    // Detect language from file path
    const detectedLang = filePath.includes('/en/') ? 'en' : 
                        filePath.includes('/pt/') ? 'pt' : null
    
    if (!detectedLang) {
      errors.push('Cannot detect language from file path. Content must be in /pt/ or /en/ directory')
    }
    
    if (content.language && content.language !== detectedLang) {
      errors.push(`Language mismatch: frontmatter says "${content.language}" but path indicates "${detectedLang}"`)
    }
    
    // Language-specific title/description requirements
    if (detectedLang === 'pt') {
      if (frontmatter.title && /^[A-Z][a-z]+ [A-Z]/.test(frontmatter.title)) {
        // Detectar títulos em inglês em conteúdo PT
        errors.push('Title appears to be in English but content is in Portuguese directory')
      }
    }
    
    return errors
  },

  /**
   * Validate SEO optimization
   */
  validateSEO(frontmatter) {
    const errors = []
    const { title, description, keywords = [], seo = {} } = frontmatter
    
    // Title length optimization
    if (title && title.length > 60) {
      errors.push(`Title too long for SEO (${title.length} chars). Recommended: ≤60`)
    }
    
    // Description length optimization  
    if (description && description.length > 155) {
      errors.push(`Description too long for SEO (${description.length} chars). Recommended: ≤155`)
    }
    
    // Keywords density
    if (keywords.length > 8) {
      errors.push(`Too many keywords (${keywords.length}). Recommended: 3-8 for optimal SEO`)
    }
    
    // Open Graph validation
    if (seo.og_image && !seo.og_image.startsWith('/images/')) {
      errors.push('Open Graph images should be in /images/ directory')
    }
    
    return errors
  },

  /**
   * Validate content versioning
   */
  validateVersioning(frontmatter) {
    const errors = []
    const { content = {} } = frontmatter
    
    if (content.version && !/^\d+\.\d+\.\d+$/.test(content.version)) {
      errors.push('Content version must follow semantic versioning (e.g., "1.0.0")')
    }
    
    if (content.last_updated) {
      const updateDate = new Date(content.last_updated)
      const now = new Date()
      
      if (updateDate > now) {
        errors.push('Last updated date cannot be in the future')
      }
      
      if (content.review_date) {
        const reviewDate = new Date(content.review_date)
        if (reviewDate <= updateDate) {
          errors.push('Review date should be after last updated date')
        }
      }
    }
    
    return errors
  },

  /**
   * Run all validation rules
   */
  validateAll(frontmatter, filePath) {
    const allErrors = [
      ...this.validateFrameworkContent(frontmatter),
      ...this.validateNavigation(frontmatter, filePath),
      ...this.validateMultilingual(frontmatter, filePath),
      ...this.validateSEO(frontmatter),
      ...this.validateVersioning(frontmatter)
    ]
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: this.generateWarnings(frontmatter, filePath)
    }
  },

  /**
   * Generate warnings for best practices
   */
  generateWarnings(frontmatter, filePath) {
    const warnings = []
    
    // Missing optional but recommended fields
    if (!frontmatter.keywords || frontmatter.keywords.length === 0) {
      warnings.push('Consider adding keywords for better searchability')
    }
    
    if (!frontmatter.navigation?.icon) {
      warnings.push('Consider adding an icon for better navigation UX')
    }
    
    if (!frontmatter.content?.related_pages) {
      warnings.push('Consider adding related pages for better content discovery')
    }
    
    if (frontmatter.framework && !frontmatter.navigation?.badge) {
      warnings.push('Framework content should consider displaying a framework badge')
    }
    
    return warnings
  }
}

export default ValidationRules