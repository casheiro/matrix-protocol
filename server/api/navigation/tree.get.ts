/**
 * Navigation Tree API
 * 
 * Dynamically discovers and builds navigation tree from content files
 * Respects frontmatter configuration (order, navigation, sidebar)
 * Provides caching for performance optimization
 */
import { readdir } from 'fs/promises'
import { join, resolve, basename } from 'path'
import matter from 'gray-matter'
import { readFile } from 'fs/promises'

interface NavigationNode {
  title: string
  path: string
  order: number
  children?: NavigationNode[]
  framework?: string
  icon?: string
  description?: string
  isActive?: boolean
  level: number
}

interface ContentFile {
  path: string
  title: string
  order: number
  navigation: boolean
  sidebar: boolean
  framework?: string
  icon?: string
  description?: string
  lang: string
}

interface DirectoryNode {
  path: string
  name: string
  indexFile?: ContentFile
  children: DirectoryNode[]
  files: ContentFile[]
  level: number
}

// Cache para otimização
const navigationCache = new Map<string, { data: NavigationNode[], timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = (query.locale as string) || 'pt'
  const section = (query.section as string) || 'docs'
  const depth = parseInt(query.depth as string) || 10
  const force = query.force === 'true'

  // Verifica cache primeiro
  const cacheKey = `${locale}-${section}-${depth}`
  if (!force && navigationCache.has(cacheKey)) {
    const cached = navigationCache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return {
        tree: cached.data,
        cached: true,
        locale,
        section,
        timestamp: cached.timestamp
      }
    }
  }

  try {
    // Constrói o caminho base para o conteúdo
    const contentPath = resolve(process.cwd(), 'content', locale, section)
    
    // Constrói a árvore hierárquica usando descoberta recursiva
    const tree = await buildNavigationTree(contentPath, locale, section, `/${locale}/${section}`)
    
    // Conta total de arquivos processados
    const totalFiles = countTotalFiles(tree)
    
    // Armazena no cache
    navigationCache.set(cacheKey, {
      data: tree,
      timestamp: Date.now()
    })
    
    return {
      tree,
      cached: false,
      locale,
      section,
      timestamp: Date.now(),
      totalFiles
    }

  } catch (error) {
    console.error('Erro ao construir árvore de navegação:', error)
    
    // Fallback para navegação básica em caso de erro
    return {
      tree: getFallbackNavigation(locale, section),
      cached: false,
      locale,
      section,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }
  }
})


/**
 * Descobre a estrutura completa de diretórios e arquivos markdown
 */
async function discoverDirectoryStructure(dirPath: string, locale: string, section: string): Promise<DirectoryNode> {
  const projectRoot = resolve(process.cwd())
  const relativePath = dirPath.replace(projectRoot, '').replace(/^\/content\//, '').replace(`/${locale}/${section}`, '')
  
  const node: DirectoryNode = {
    path: relativePath || '',
    name: basename(dirPath),
    indexFile: undefined,
    children: [],
    files: [],
    level: relativePath.split('/').filter(Boolean).length
  }
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      
      if (entry.isDirectory()) {
        // Recursivamente descobre subdiretórios
        const childNode = await discoverDirectoryStructure(fullPath, locale, section)
        node.children.push(childNode)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Processa arquivo markdown
        try {
          const fileContent = await readFile(fullPath, 'utf-8')
          const { data: frontmatter } = matter(fileContent)
          
          // Só inclui arquivos com frontmatter válido para navegação
          if (!frontmatter.title || frontmatter.navigation === false || frontmatter.sidebar === false) {
            continue
          }
          
          const generatedPath = getPathFromFile(fullPath, locale)
          
          // Valida se o path gerado é válido
          if (!generatedPath || generatedPath === `/${locale}` || !generatedPath.startsWith(`/${locale}/${section}`)) {
            continue
          }
          
          const contentFile: ContentFile = {
            path: generatedPath,
            title: frontmatter.title,
            order: frontmatter.order || 999,
            navigation: frontmatter.navigation !== false,
            sidebar: frontmatter.sidebar !== false,
            framework: frontmatter.framework,
            icon: frontmatter.icon,
            description: frontmatter.description,
            lang: frontmatter.lang || locale
          }
          
          // Se é um index.md, marca como arquivo índice do diretório
          if (entry.name === 'index.md') {
            node.indexFile = contentFile
          } else {
            node.files.push(contentFile)
          }
          
        } catch (fileError) {
          console.warn(`Erro ao processar arquivo ${fullPath}:`, fileError)
        }
      }
    }
    
    // Ordena children e files por order
    node.children.sort((a, b) => (a.indexFile?.order || 999) - (b.indexFile?.order || 999))
    node.files.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    
  } catch (dirError) {
    console.warn(`Erro ao ler diretório ${dirPath}:`, dirError)
  }
  
  return node
}

/**
 * Converte caminho do arquivo para URL path
 */
function getPathFromFile(filePath: string, locale: string): string {
  // Remove o caminho base do projeto
  const projectRoot = resolve(process.cwd())
  let relativePath = filePath.replace(projectRoot, '')
  
  // Remove /content/ do início
  relativePath = relativePath.replace(/^\/content\//, '/')
  
  // Remove .md do final
  relativePath = relativePath.replace(/\.md$/, '')
  
  // Converte index para /
  relativePath = relativePath.replace(/\/index$/, '')
  
  // Garante que o path comece com /
  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath
  }
  
  return relativePath || `/${locale}`
}

/**
 * Converte a estrutura de diretórios em árvore de navegação
 */
function convertDirectoryToNavigation(dirNode: DirectoryNode, basePath: string): NavigationNode[] {
  const nodes: NavigationNode[] = []
  
  // Adiciona arquivos na raiz do diretório atual
  dirNode.files.forEach(file => {
    nodes.push(createNavigationNode(file, dirNode.level))
  })
  
  // Processa subdiretórios
  dirNode.children.forEach(childDir => {
    // Se o diretório tem um index.md, usa ele como representante
    if (childDir.indexFile) {
      const sectionNode: NavigationNode = {
        title: childDir.indexFile.title,
        path: childDir.indexFile.path,
        order: childDir.indexFile.order,
        framework: childDir.indexFile.framework,
        icon: childDir.indexFile.icon,
        description: childDir.indexFile.description,
        level: childDir.level,
        children: undefined
      }
      
      // Recursivamente adiciona filhos do subdiretório
      const childNodes = convertDirectoryToNavigation(childDir, basePath)
      if (childNodes.length > 0) {
        sectionNode.children = childNodes
      }
      
      nodes.push(sectionNode)
    } else {
      // Se não tem index.md, usa o nome da pasta e adiciona filhos diretamente
      const sectionNode: NavigationNode = {
        title: childDir.name.charAt(0).toUpperCase() + childDir.name.slice(1),
        path: `${basePath}/${childDir.path}`,
        order: 999,
        level: childDir.level,
        children: undefined
      }
      
      // Recursivamente adiciona filhos do subdiretório
      const childNodes = convertDirectoryToNavigation(childDir, basePath)
      if (childNodes.length > 0) {
        sectionNode.children = childNodes
      }
      
      nodes.push(sectionNode)
    }
  })
  
  // Ordena por order e depois por título
  return nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

/**
 * Constrói árvore hierárquica de navegação (estilo Docusaurus)
 */
async function buildNavigationTree(contentPath: string, locale: string, section: string, basePath: string): Promise<NavigationNode[]> {
  // Descobre a estrutura completa de diretórios
  const rootNode = await discoverDirectoryStructure(contentPath, locale, section)
  
  // Converte para árvore de navegação
  return convertDirectoryToNavigation(rootNode, basePath)
}

/**
 * Conta o total de arquivos em uma árvore de navegação
 */
function countTotalFiles(tree: NavigationNode[]): number {
  let count = 0
  
  for (const node of tree) {
    count++ // Conta o próprio nó
    
    if (node.children) {
      count += countTotalFiles(node.children) // Conta recursivamente os filhos
    }
  }
  
  return count
}

/**
 * Cria nó de navegação para arquivo
 */
function createNavigationNode(file: ContentFile, level: number): NavigationNode {
  return {
    title: file.title,
    path: file.path,
    order: file.order,
    framework: file.framework,
    icon: file.icon,
    description: file.description,
    level
  }
}

/**
 * Navegação de fallback em caso de erro
 */
function getFallbackNavigation(locale: string, section: string): NavigationNode[] {
  if (section === 'frameworks') {
    return [
      {
        title: 'Frameworks Matrix Protocol',
        path: `/${locale}/frameworks`,
        order: 0,
        level: 0,
        children: [
          { title: 'MEF - Matrix Embedding Framework', path: `/${locale}/frameworks/mef`, order: 1, level: 1 },
          { title: 'MEF Ontology', path: `/${locale}/frameworks/mef-ontology`, order: 2, level: 1 },
          { title: 'ZOF - Zion Orchestration Framework', path: `/${locale}/frameworks/zof`, order: 3, level: 1 },
          { title: 'OIF - Operator Intelligence Framework', path: `/${locale}/frameworks/oif`, order: 4, level: 1 },
          { title: 'MOC - Matrix Ontology Catalog', path: `/${locale}/frameworks/moc`, order: 5, level: 1 },
          { title: 'Inference & Reasoning', path: `/${locale}/frameworks/inference-reasoning`, order: 6, level: 1 },
          { title: 'MAL - Matrix Arbiter Layer', path: `/${locale}/frameworks/mal`, order: 7, level: 1 }
        ]
      }
    ]
  }
  
  return []
}