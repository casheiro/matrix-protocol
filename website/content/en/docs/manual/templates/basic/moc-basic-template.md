---
title: Moc Basic Template
description: Wrapper page for YAML asset moc-basic-template.yaml
layout: docs
sidebar: true
toc: true
navigation: true
icon: i-heroicons-document-duplicate
lang: en
last_updated: 2025-10-21
framework: MEF
maturity: stable
tags:
  - manual
  - templates
order: 10
---
> Source YAML: `en/docs/manual/templates/basic/moc-basic-template.yaml`

**Open in Viewer:** [Moc Basic Template](/en/docs/viewer?file=/docs/manual/templates/basic/moc-basic-template.yaml)

> 📄 Type: YAML • 📦 Size: 5.5 KB • 🕒 Last updated: 2025-10-12



```yaml

# Basic MOC Template - Ready to Use
# Ultra-simplified template for quick Matrix Protocol implementation
# Suitable for any organization size (5-1000+ people)
# Customize this template based on your needs

moc_version: "1.0"
organization: "[YOUR_ORGANIZATION_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "0.0.1"

# =============================================================================
# BASIC CONFIGURATION - Only essential hierarchies
# =============================================================================

hierarchies:
  # Knowledge Visibility and Access Control
  scope:
    metadata:
      concept: "Who can access what type of knowledge"
      governance_rules: |
        Simple 3-level model covering all organizational sizes:
        - Company: Everyone can access
        - Team: Team members + leadership
        - Personal: Individual + direct manager only
      level_semantics: |
        Level 0 = Public to entire organization
        Level 1 = Team-specific access
        Level 2 = Personal/private access
        
    nodes:
      - id: "public"
        label: "Company Knowledge"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees"]
          propagation: "automatic"
          authority_required: "any_employee"
          
      - id: "team"
        label: "Team Knowledge"
        parent: "public"
        level: 1
        governance:
          visibility: ["team_members", "managers"]
          propagation: "restricted"
          authority_required: "team_lead"
          
      - id: "personal"
        label: "Personal Notes"
        parent: null
        level: 2
        governance:
          visibility: ["individual", "direct_manager"]
          propagation: "blocked"
          authority_required: "individual"

  # Knowledge Categories
  domain:
    metadata:
      concept: "What type of knowledge this is"
      governance_rules: "Essential knowledge areas for any organization"
      
    nodes:
      - id: "technical"
        label: "Technical & Development"
        governance:
          owners: ["tech_team"]
          reviewers: ["senior_developers"]
          
      - id: "business"
        label: "Business & Strategy" 
        governance:
          owners: ["management_team"]
          reviewers: ["team_leads"]
          
      - id: "operations"
        label: "Operations & Processes"
        governance:
          owners: ["ops_team"]
          reviewers: ["all_employees"]

  # Knowledge Quality Level
  maturity:
    metadata:
      concept: "How validated and reliable this knowledge is"
      governance_rules: "Progressive validation levels from draft to standard"
      level_semantics: |
        Level 0 = Draft (work in progress)
        Level 1 = Reviewed (validated by team)
        Level 2 = Standard (approved by organization)
        
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          validation_required: false
          creation_authority: "any_employee"
          auto_expire_days: 90
          
      - id: "reviewed"
        label: "Team Reviewed"
        parent: "draft"
        level: 1
        governance:
          validation_required: true
          reviewers_required: 1
          authority_required: "team_lead"
          
      - id: "standard"
        label: "Organization Standard"
        parent: "reviewed"
        level: 2
        governance:
          validation_required: true
          authority_required: "management"
          mandatory_compliance: true

  # Content Format Type
  type:
    metadata:
      concept: "How this knowledge is structured"
      
    nodes:
      - id: "decision"
        label: "Decision Record"
        governance:
          required_fields: ["context", "decision", "rationale"]
          review_required: true
          
      - id: "process"
        label: "Process Documentation"
        governance:
          required_fields: ["steps", "owner", "frequency"]
          update_frequency_months: 6
          
      - id: "reference"
        label: "Reference Material"
        governance:
          required_fields: ["summary", "usage", "examples"]
          
      - id: "learning"
        label: "Learning & Knowledge"
        governance:
          required_fields: ["summary", "key_points", "applications"]
          sharing_encouraged: true

# =============================================================================
# QUICK START GUIDANCE
# =============================================================================

# How to use this template:
# 1. Replace [YOUR_ORGANIZATION_NAME] with your organization's name
# 2. Update dates and version
# 3. Customize node IDs and labels to match your teams/functions
# 4. Adjust governance rules based on your organizational needs
# 5. Add more hierarchies or nodes as your organization grows
#
# For more specialized templates by organizational size:
# - MOC_STARTUP_TEMPLATE.yaml (5-50 people)
# - MOC_SCALEUP_TEMPLATE.yaml (50-200 people) 
# - MOC_ENTERPRISE_TEMPLATE.yaml (200-1000 people)
# - MOC_CORPORATION_TEMPLATE.yaml (1000+ people)

# Usage Examples:
examples:
  basic_uki:
    scope: "team"
    domain: "technical"
    maturity: "draft" 
    type: "decision"
    title: "Example: Database Migration Decision"
    
  company_standard:
    scope: "public"
    domain: "operations"
    maturity: "standard"
    type: "process"
    title: "Example: Employee Onboarding Process"
    
  personal_note:
    scope: "personal"
    domain: "business"
    maturity: "draft"
    type: "learning"
    title: "Example: My Notes from Leadership Meeting"
```
