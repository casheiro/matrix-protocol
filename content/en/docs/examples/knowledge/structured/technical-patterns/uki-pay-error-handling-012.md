---
title: Uki Pay Error Handling 012
description: Wrapper page for YAML asset uki-pay-error-handling-012.yaml
icon: i-heroicons-code-bracket
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21T00:00:00.000Z
order: 10
framework: general
tags:
  - examples
  - structured
  - technical-patterns
keywords:
  - Matrix Protocol
  - examples
  - use cases
  - knowledge
  - structured
  - technical patterns
  - UKI
---
> Source YAML: `en/docs/examples/knowledge/structured/technical-patterns/uki-pay-error-handling-012.yaml`

**Open in Viewer:** [Uki Pay Error Handling 012](/en/docs/viewer?file=/docs/examples/knowledge/structured/technical-patterns/uki-pay-error-handling-012.yaml)

> 📄 Type: YAML • 📦 Size: 6.0 KB • 🕒 Last updated: 2025-10-12



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
id: uki:squad-payments:technical_pattern:error-handling-012
title: "Error Handling and Secure Logging Pattern"
version: 1.2.0
created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Implementation of data masking for PCI compliance"
change_impact: minor
previous_version: 1.1.0

scope_ref: squad-payments
domain_ref: technical
type_ref: pattern
maturity_ref: validated
status: active

content: |
  ## Error Classification
  
  ### Client Errors (4xx)
  **Validation errors:** 400 Bad Request
  **Authentication:** 401 Unauthorized  
  **Authorization:** 403 Forbidden
  **Not found:** 404 Not Found
  **Business rule violation:** 422 Unprocessable Entity
  
  ### Server Errors (5xx)
  **Internal errors:** 500 Internal Server Error
  **Gateway timeout:** 502 Bad Gateway
  **Service unavailable:** 503 Service Unavailable
  **Timeout:** 504 Gateway Timeout
  
  ## Structured Error Response Format
  
  ```json
  {
    "error": {
      "code": "PAYMENT_VALIDATION_FAILED",
      "message": "Credit card validation failed",
      "details": "Invalid CVV format",
      "correlation_id": "req-f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "timestamp": "2024-03-25T10:30:00Z",
      "retriable": false
    }
  }
  ```

  
  ## Data Masking for PCI Compliance
  
  ### Sensitive Data Patterns
  **Credit card numbers:** `\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}`
  **CVV:** `\b\d{3,4}\b`
  **Email:** Pattern-based detection
  **SSN/TIN:** US document patterns
  
  ### Masking Implementation
  ```java
  public class DataMasker {
      public static String maskCreditCard(String input) {
          return input.replaceAll("\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?(\\d{4})", 
                                 "****-****-****-$1");
      }
      
      public static String maskCVV(String input) {
          return input.replaceAll("\\b\\d{3,4}\\b", "***");
      }
  }
  ```

  
  ## Logging Strategy
  
  ### Log Levels by Environment
  **Production:**
  - ERROR: Always logged with correlation ID
  - WARN: Business rule violations, retry attempts
  - INFO: Request/response without sensitive data
  - DEBUG: Disabled
  
  **Staging:**
  - All levels enabled
  - Additional performance metrics
  - Extended request/response logging
  
  **Development:**
  - All levels including TRACE
  - Sensitive data masked but more verbose
  - Stack traces included
  
  ### Structured Logging Format
  ```json
  {
    "timestamp": "2024-03-25T10:30:00.123Z",
    "level": "ERROR",
    "logger": "com.company.payments.PaymentController",
    "message": "Payment processing failed",
    "correlation_id": "req-f47ac10b-58cc",
    "user_id": "user123",
    "gateway": "stripe",
    "error_code": "GATEWAY_TIMEOUT",
    "sensitive_data_masked": true
  }
  ```

  
  ## Exception Handling Hierarchy
  
  ### Custom Exceptions
  ```java
  // Base exception
  public abstract class PaymentException extends Exception {
      private final String errorCode;
      private final boolean retriable;
  }
  
  // Specific exceptions
  public class GatewayTimeoutException extends PaymentException // retriable=true
  public class ValidationException extends PaymentException     // retriable=false
  public class FraudDetectedException extends PaymentException  // retriable=false
  ```

  
  ### Global Exception Handler
  ```java
  @ControllerAdvice
  public class GlobalExceptionHandler {
      
      @ExceptionHandler(PaymentException.class)
      public ResponseEntity<ErrorResponse> handlePaymentException(PaymentException e) {
          // Log with appropriate level
          // Mask sensitive data
          // Return structured error response
      }
  }
  ```

  
  ## Stack Trace Management
  
  ### Production Environment
  **Client response:** Generic error message only
  **Internal logging:** Full stack trace with correlation ID
  **Monitoring:** Stack trace hashing for duplicate detection
  
  ### Debug Information
  **Correlation ID:** Always present for traceability
  **Request context:** User ID, session, gateway used
  **Business context:** Payment amount (masked), operation type
  
  ## Monitoring Integration
  
  ### Error Metrics
  **Error rate by endpoint:** Percentage of 4xx/5xx responses
  **Error distribution:** Count by error code
  **Gateway errors:** Separate tracking per gateway
  **Recovery rate:** Errors resolved by retry
  
  ### Alerting Thresholds
  **Critical (PagerDuty):**
  - 5xx error rate > 5% sustained 5 minutes
  - Any 500 error with payment processing
  - Sensitive data leak detected in logs
  
  **Warning (Slack):**
  - 4xx error rate > 20% sustained 10 minutes
  - New error code not seen before
  - Retry success rate < 80%
  
  ## Security Considerations
  
  ### Information Disclosure Prevention
  - Never expose internal system details in client errors
  - Mask database constraint violations
  - Generic messages for security-related failures
  
  ### Audit Trail
  - All payment-related errors logged for compliance
  - Correlation IDs for cross-system tracing
  - Sensitive actions logged with user context

examples:
  - input: "Credit card 4111111111111111, CVV 123 in error log"
    output: "Logged as: Credit card ****-****-****-1111, CVV *** with masking flag"
  - input: "Database connection timeout during payment processing"
    output: "Return 503 Service Unavailable, log 500 with correlation ID, alert sent"
  - input: "Validation error: invalid email format"
    output: "Return 400 with specific field error, log INFO level, no alert"

related_to:
  - target: uki:squad-payments:procedure:pci-compliance-013
    type: implements
    description: "Data masking implements PCI requirements for data protection"
  - target: uki:squad-payments:procedure:monitoring-alerts-016
    type: integrates
    description: "Error handling integrated with monitoring and alerting system"
  - target: uki:squad-payments:technical_pattern:gateway-integration-007
    type: relates_to
    description: "Error handling specific to gateway failures"

domain_of_influence: "engineering_teams"
```
