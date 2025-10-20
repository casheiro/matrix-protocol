---
title: "Uki Pay Security Headers 010"
description: "Wrapper page for YAML asset uki-pay-security-headers-010.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/examples/knowledge/structured/technical-patterns/uki-pay-security-headers-010.yaml`

**Open in Viewer:** [Uki Pay Security Headers 010](/en/docs/viewer?file=/docs/examples/knowledge/structured/technical-patterns/uki-pay-security-headers-010.yaml)

> 📄 Type: YAML • 📦 Size: 4.9 KB • 🕒 Last updated: 2025-10-12



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
id: uki:squad-payments:technical_pattern:security-headers-010
title: "Security Headers for Payment Applications"
version: 1.1.0
created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Addition of CSP policy specific for PCI compliance"
change_impact: minor
previous_version: 1.0.0

scope_ref: squad-payments
domain_ref: technical
type_ref: pattern
maturity_ref: validated
status: active

content: |
  ## Mandatory Headers for PCI Compliance
  
  ### Content Security Policy (CSP)
  ```http
  Content-Security-Policy: 
    default-src 'self';
    script-src 'self' https://js.stripe.com https://checkout.paypal.com;
    style-src 'self' 'unsafe-inline' https://checkout.paypal.com;
    img-src 'self' data: https://*.stripe.com https://*.paypal.com;
    connect-src 'self' https://api.stripe.com https://api.paypal.com;
    frame-src https://js.stripe.com https://checkout.paypal.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://checkout.paypal.com
  ```

  
  ### HTTP Strict Transport Security (HSTS)  
  ```http
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```

  **Rationale:** Forces HTTPS for 1 year, prevents downgrade attacks
  
  ### X-Frame-Options
  ```http
  X-Frame-Options: DENY
  ```

  **Rationale:** Prevents clickjacking on payment pages
  
  ### X-Content-Type-Options
  ```http
  X-Content-Type-Options: nosniff
  ```

  **Rationale:** Prevents MIME-type sniffing attacks
  
  ### Referrer-Policy
  ```http
  Referrer-Policy: strict-origin-when-cross-origin
  ```

  **Rationale:** Protects sensitive information in URLs
  
  ## API-Specific Headers
  
  ### X-Permitted-Cross-Domain-Policies
  ```http
  X-Permitted-Cross-Domain-Policies: none
  ```

  **Rationale:** Blocks Flash/Silverlight cross-domain requests
  
  ### Cache-Control for Sensitive Endpoints
  ```http
  Cache-Control: no-store, no-cache, must-revalidate, private
  Pragma: no-cache
  Expires: 0
  ```

  **Apply to:** `/payments/*`, `/admin/*`, `/webhooks/*`
  
  ## Implementation Pattern
  
  ### Spring Boot Configuration
  ```java
  @Configuration
  public class SecurityHeadersConfig {
      
      @Bean
      public FilterRegistrationBean<SecurityHeadersFilter> securityHeadersFilter() {
          FilterRegistrationBean<SecurityHeadersFilter> registration = 
              new FilterRegistrationBean<>();
          registration.setFilter(new SecurityHeadersFilter());
          registration.addUrlPatterns("/*");
          registration.setOrder(1);
          return registration;
      }
  }
  ```

  
  ### Nginx Configuration (Proxy Level)
  ```nginx
  add_header X-Frame-Options DENY always;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  ```

  
  ## Environment-Specific Variations
  
  ### Development Environment
  - CSP: Allow 'unsafe-eval' for development tools
  - HSTS: Reduced max-age (3600s)
  - Additional debug headers for troubleshooting
  
  ### Staging Environment  
  - Production-like headers
  - Additional CSP reporting endpoint
  - Test certificate for HSTS preload validation
  
  ### Production Environment
  - Full restrictive policy
  - CSP violation reporting to security team
  - HSTS preload submission to browsers
  
  ## Monitoring and Compliance
  
  **CSP Violation Reports:**
  - Endpoint: `/csp-violation-report`
  - Alert threshold: > 10 violations/hour
  - Daily review of violation patterns
  
  **Header Validation:**
  - Automated tests: Header presence validation
  - Security scanner: Weekly OWASP ZAP scan
  - Manual review: Quarterly security audit
  
  **Compliance Checklist:**
  - [ ] All headers present in production
  - [ ] CSP allows only trusted domains  
  - [ ] HSTS submitted to preload list
  - [ ] Headers tested in all supported browsers
  - [ ] Violation monitoring functional

examples:
  - input: "Request to /payments/checkout from browser"
    output: "All security headers applied, CSP allows Stripe/PayPal, HSTS enforces HTTPS"
  - input: "AJAX call to /api/payments from untrusted origin"  
    output: "CORS blocked, CSP violations logged, security headers in response"
  - input: "CSP violation: inline script execution attempt"
    output: "Violation logged, request blocked, alert sent to security team"

related_to:
  - target: uki:squad-payments:procedure:pci-compliance-013
    type: implements
    description: "Security headers are mandatory requirement for PCI compliance"
  - target: uki:squad-payments:technical_pattern:gateway-integration-007
    type: relates_to
    description: "Headers enable secure integration with external gateways"
  - target: uki:squad-payments:procedure:monitoring-alerts-016
    type: relates_to
    description: "CSP violations integrated with alerting system"

domain_of_influence: "engineering_teams"
```
