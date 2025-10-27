#!/usr/bin/env python3
"""
Link Crawler - Script de scraping recursivo para mapear todos os links do site
Navega por todos os links internos e verifica se estão funcionando.
"""

import requests
import time
import json
import csv
from urllib.parse import urljoin, urlparse, parse_qs
from bs4 import BeautifulSoup
from datetime import datetime
import argparse
import sys
from collections import defaultdict

class LinkCrawler:
    def __init__(self, base_url, delay=1, max_depth=10, timeout=10):
        self.base_url = base_url.rstrip('/')
        self.domain = urlparse(base_url).netloc
        self.delay = delay
        self.max_depth = max_depth
        self.timeout = timeout
        
        # Controle de estado
        self.visited_urls = set()
        self.found_links = {}  # url -> {status, error, depth, referrer}
        self.queue = [(base_url, 0, None)]  # (url, depth, referrer)
        
        # Estatísticas
        self.stats = defaultdict(int)
        
        # Session para reutilizar conexões
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'LinkCrawler/1.0 (Site Health Check)'
        })
    
    def is_internal_url(self, url):
        """Verifica se a URL é interna ao domínio."""
        parsed = urlparse(url)
        return parsed.netloc == self.domain or parsed.netloc == ''
    
    def normalize_url(self, url):
        """Normaliza URL removendo fragmentos e ordenando query params."""
        parsed = urlparse(url)
        # Remove fragmentos (#)
        url_without_fragment = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if parsed.query:
            # Ordena query parameters para evitar duplicatas
            query_dict = parse_qs(parsed.query)
            sorted_query = '&'.join([f"{k}={v[0]}" for k, v in sorted(query_dict.items())])
            url_without_fragment += f"?{sorted_query}"
        return url_without_fragment
    
    def extract_links(self, html_content, current_url):
        """Extrai todos os links de uma página."""
        soup = BeautifulSoup(html_content, 'html.parser')
        links = []
        
        # Links em tags <a>
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(current_url, href)
            links.append(full_url)
        
        # Links em tags <link> (CSS, etc)
        for link in soup.find_all('link', href=True):
            href = link['href']
            if not href.startswith('data:'):  # Ignora data URLs
                full_url = urljoin(current_url, href)
                links.append(full_url)
        
        # Scripts
        for script in soup.find_all('script', src=True):
            src = script['src']
            if not src.startswith('data:'):
                full_url = urljoin(current_url, src)
                links.append(full_url)
        
        # Imagens
        for img in soup.find_all('img', src=True):
            src = img['src']
            if not src.startswith('data:'):
                full_url = urljoin(current_url, src)
                links.append(full_url)
        
        return links
    
    def test_url(self, url, referrer=None):
        """Testa se uma URL está funcionando."""
        try:
            print(f"Testing: {url}")
            response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            
            result = {
                'status_code': response.status_code,
                'error': None,
                'final_url': response.url,
                'referrer': referrer,
                'content_type': response.headers.get('content-type', ''),
                'timestamp': datetime.now().isoformat()
            }
            
            if response.status_code >= 400:
                result['error'] = f"HTTP {response.status_code}"
                self.stats['error'] += 1
                print(f"  ❌ ERROR {response.status_code}")
            else:
                self.stats['success'] += 1
                print(f"  ✅ OK {response.status_code}")
            
            return result, response.text if response.status_code == 200 else None
            
        except requests.exceptions.Timeout:
            error_msg = "Timeout"
            print(f"  ⏰ TIMEOUT")
        except requests.exceptions.ConnectionError:
            error_msg = "Connection Error"
            print(f"  🔌 CONNECTION ERROR")
        except requests.exceptions.RequestException as e:
            error_msg = str(e)
            print(f"  ❌ REQUEST ERROR: {e}")
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            print(f"  💥 UNEXPECTED ERROR: {e}")
        
        self.stats['error'] += 1
        return {
            'status_code': None,
            'error': error_msg,
            'final_url': url,
            'referrer': referrer,
            'content_type': '',
            'timestamp': datetime.now().isoformat()
        }, None
    
    def crawl(self):
        """Executa o crawling recursivo."""
        print(f"🚀 Starting crawl from: {self.base_url}")
        print(f"📊 Config: delay={self.delay}s, max_depth={self.max_depth}, timeout={self.timeout}s")
        print("-" * 80)
        
        while self.queue:
            current_url, depth, referrer = self.queue.pop(0)
            
            # Normaliza URL
            normalized_url = self.normalize_url(current_url)
            
            # Pula se já visitou
            if normalized_url in self.visited_urls:
                continue
            
            # Pula se excedeu profundidade máxima
            if depth > self.max_depth:
                continue
            
            # Marca como visitado
            self.visited_urls.add(normalized_url)
            
            print(f"\n[Depth {depth}] {normalized_url}")
            if referrer:
                print(f"  Referrer: {referrer}")
            
            # Testa a URL
            result, html_content = self.test_url(normalized_url, referrer)
            self.found_links[normalized_url] = result
            self.found_links[normalized_url]['depth'] = depth
            
            # Se é HTML e está funcionando, extrai links
            if (html_content and 
                result['status_code'] == 200 and 
                'text/html' in result['content_type']):
                
                try:
                    links = self.extract_links(html_content, normalized_url)
                    internal_links = [link for link in links if self.is_internal_url(link)]
                    
                    print(f"  📄 Found {len(internal_links)} internal links")
                    
                    # Adiciona links à queue
                    for link in internal_links:
                        normalized_link = self.normalize_url(link)
                        if normalized_link not in self.visited_urls:
                            self.queue.append((normalized_link, depth + 1, normalized_url))
                
                except Exception as e:
                    print(f"  ⚠️  Error extracting links: {e}")
            
            # Delay entre requests
            if self.delay > 0:
                time.sleep(self.delay)
        
        print("\n" + "=" * 80)
        print("🏁 Crawling completed!")
        self.print_summary()
    
    def print_summary(self):
        """Imprime resumo dos resultados."""
        total = len(self.found_links)
        print(f"📊 SUMMARY:")
        print(f"  Total URLs tested: {total}")
        print(f"  Successful: {self.stats['success']}")
        print(f"  Errors: {self.stats['error']}")
        
        if self.stats['error'] > 0:
            print(f"\n❌ BROKEN LINKS:")
            for url, result in self.found_links.items():
                if result['status_code'] is None or result['status_code'] >= 400:
                    error = result['error'] or f"HTTP {result['status_code']}"
                    print(f"  {url} - {error}")
                    if result['referrer']:
                        print(f"    Referrer: {result['referrer']}")
    
    def save_results(self, json_file=None, csv_file=None):
        """Salva resultados em arquivos."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # JSON
        if json_file is None:
            json_file = f"link_report_{timestamp}.json"
        
        report_data = {
            'crawl_info': {
                'base_url': self.base_url,
                'timestamp': timestamp,
                'total_urls': len(self.found_links),
                'successful': self.stats['success'],
                'errors': self.stats['error']
            },
            'results': self.found_links
        }
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"📄 JSON report saved: {json_file}")
        
        # CSV
        if csv_file is None:
            csv_file = f"link_report_{timestamp}.csv"
        
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['URL', 'Status Code', 'Error', 'Depth', 'Referrer', 'Content Type', 'Final URL', 'Timestamp'])
            
            for url, result in self.found_links.items():
                writer.writerow([
                    url,
                    result['status_code'],
                    result['error'],
                    result['depth'],
                    result['referrer'],
                    result['content_type'],
                    result['final_url'],
                    result['timestamp']
                ])
        
        print(f"📊 CSV report saved: {csv_file}")

def main():
    parser = argparse.ArgumentParser(description='Recursive link crawler for site health check')
    parser.add_argument('url', help='Base URL to start crawling from')
    parser.add_argument('--delay', type=float, default=1, help='Delay between requests in seconds (default: 1)')
    parser.add_argument('--max-depth', type=int, default=10, help='Maximum crawl depth (default: 10)')
    parser.add_argument('--timeout', type=int, default=10, help='Request timeout in seconds (default: 10)')
    parser.add_argument('--json', help='JSON output file (default: auto-generated)')
    parser.add_argument('--csv', help='CSV output file (default: auto-generated)')
    
    args = parser.parse_args()
    
    try:
        crawler = LinkCrawler(
            base_url=args.url,
            delay=args.delay,
            max_depth=args.max_depth,
            timeout=args.timeout
        )
        
        crawler.crawl()
        crawler.save_results(json_file=args.json, csv_file=args.csv)
        
    except KeyboardInterrupt:
        print("\n🛑 Crawling interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"💥 Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()