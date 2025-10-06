#!/bin/bash

# validate-cross-references.sh
# Matrix Protocol Cross-Reference Validation Script
# Version: 0.0.1
# Purpose: Validate internal links, cross-references, and navigation consistency

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." &> /dev/null && pwd)"

echo -e "${BLUE}Matrix Protocol Cross-Reference Validator${NC}"
echo -e "${BLUE}==========================================${NC}"
echo "Project Root: $PROJECT_ROOT"
echo ""

# Function to increment counters
pass_check() {
    ((TOTAL_CHECKS++))
    ((PASSED_CHECKS++))
    echo -e "  ${GREEN}✓${NC} $1"
}

fail_check() {
    ((TOTAL_CHECKS++))
    ((FAILED_CHECKS++))
    echo -e "  ${RED}✗${NC} $1"
}

warn_check() {
    ((TOTAL_CHECKS++))
    ((WARNING_CHECKS++))
    echo -e "  ${YELLOW}⚠${NC} $1"
}

# Function to check if file exists
check_file_exists() {
    local file_path="$1"
    local reference_file="$2"
    local line_number="$3"
    
    if [[ -f "$PROJECT_ROOT/$file_path" ]]; then
        pass_check "File exists: $file_path"
        return 0
    else
        fail_check "Missing file: $file_path (referenced in $reference_file:$line_number)"
        return 1
    fi
}

# Function to check if section anchor exists in file
check_section_anchor() {
    local file_path="$1"
    local anchor="$2"
    local reference_file="$3"
    local line_number="$4"
    
    if [[ -f "$PROJECT_ROOT/$file_path" ]]; then
        # Convert anchor to the format used in markdown files
        # Remove the # and convert to lowercase, replace spaces/special chars with hyphens
        local section_pattern=$(echo "$anchor" | sed 's/^#//' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
        
        # Check for various heading formats
        if grep -q -E "^#{1,6}[[:space:]]*.*$section_pattern" "$PROJECT_ROOT/$file_path" 2>/dev/null; then
            pass_check "Section anchor exists: $file_path#$anchor"
            return 0
        else
            warn_check "Section anchor not found: $file_path#$anchor (referenced in $reference_file:$line_number)"
            return 1
        fi
    else
        fail_check "Cannot check anchor in missing file: $file_path"
        return 1
    fi
}

# Function to validate internal markdown links
validate_internal_links() {
    echo -e "${BLUE}Checking Internal Markdown Links...${NC}"
    
    local md_files=($(find "$PROJECT_ROOT" -name "*.md" -not -path "*/website/*" -not -path "*/.git/*"))
    
    for file in "${md_files[@]}"; do
        local relative_file=${file#$PROJECT_ROOT/}
        echo "Checking: $relative_file"
        
        # Find all markdown links [text](path) and [text](path#anchor)
        while IFS= read -r line_content; do
            local line_number=$(echo "$line_content" | cut -d: -f1)
            local line_text=$(echo "$line_content" | cut -d: -f2-)
            
            # Extract links [text](path) or [text](path#anchor)
            echo "$line_text" | grep -oE '\[([^\]]*)\]\(([^)]+)\)' | while read -r link; do
                # Extract the path part from [text](path)
                local path=$(echo "$link" | sed 's/.*](\([^#)]*\).*/\1/')
                local anchor=""
                
                # Check if there's an anchor
                if [[ "$link" == *"#"* ]]; then
                    anchor=$(echo "$link" | sed 's/.*#\([^)]*\)).*/\1/')
                fi
                
                # Skip external links (http/https)
                if [[ "$path" =~ ^https?:// ]]; then
                    continue
                fi
                
                # Skip empty paths or just anchors
                if [[ -z "$path" || "$path" == "#"* ]]; then
                    continue
                fi
                
                # Resolve relative path
                local file_dir=$(dirname "$file")
                local resolved_path=""
                
                if [[ "$path" == /* ]]; then
                    # Absolute path from project root
                    resolved_path=${path#/}
                else
                    # Relative path
                    resolved_path=$(realpath --relative-to="$PROJECT_ROOT" "$file_dir/$path" 2>/dev/null || echo "$path")
                fi
                
                # Check if file exists
                check_file_exists "$resolved_path" "$relative_file" "$line_number"
                
                # Check anchor if present
                if [[ -n "$anchor" ]]; then
                    check_section_anchor "$resolved_path" "$anchor" "$relative_file" "$line_number"
                fi
            done
        done < <(grep -n '\[.*\](.*)' "$file" 2>/dev/null || true)
    done
}

# Function to check navigation map consistency
validate_navigation_map() {
    echo -e "${BLUE}Checking Navigation Map Consistency...${NC}"
    
    local nav_map="$PROJECT_ROOT/NAVIGATION_MAP.md"
    
    if [[ ! -f "$nav_map" ]]; then
        fail_check "NAVIGATION_MAP.md not found"
        return 1
    fi
    
    pass_check "NAVIGATION_MAP.md exists"
    
    # Extract file paths from navigation map
    while IFS= read -r line; do
        if [[ "$line" =~ \|[[:space:]]*\`([^|]+)\`[[:space:]]*\| ]]; then
            local file_path=$(echo "${BASH_REMATCH[1]}" | sed 's/^`\|`$//g' | sed 's/^\///')
            
            # Skip website URLs and placeholders
            if [[ "$file_path" =~ ^https?:// ]] || [[ "$file_path" == *"website"* ]]; then
                continue
            fi
            
            # Check if the referenced file exists
            check_file_exists "$file_path" "NAVIGATION_MAP.md" "line"
        fi
    done < "$nav_map"
}

# Function to check framework cross-references
validate_framework_references() {
    echo -e "${BLUE}Checking Framework Cross-References...${NC}"
    
    local frameworks=(
        "MATRIX_PROTOCOL.md"
        "MEF_MATRIX_EMBEDDING_FRAMEWORK.md"
        "ZOF_ZION_ORCHESTRATION_FRAMEWORK.md"
        "OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md"
        "MOC_MATRIX_ONTOLOGY_CATALOG.md"
        "MAL_MATRIX_ARBITER_LAYER.md"
        "MEP_MATRIX_EPISTEMIC_PRINCIPLE.md"
    )
    
    for framework in "${frameworks[@]}"; do
        local file="$PROJECT_ROOT/$framework"
        
        if [[ ! -f "$file" ]]; then
            fail_check "Framework file missing: $framework"
            continue
        fi
        
        pass_check "Framework file exists: $framework"
        
        # Check if it has a cross-references section
        if grep -q "Cross-References\|cross-references\|Cross-reference" "$file"; then
            pass_check "Has cross-references section: $framework"
        else
            warn_check "Missing cross-references section: $framework"
        fi
        
        # Check if it references the main protocol
        if [[ "$framework" != "MATRIX_PROTOCOL.md" ]]; then
            if grep -q "MATRIX_PROTOCOL.md" "$file"; then
                pass_check "References main protocol: $framework"
            else
                warn_check "Missing reference to main protocol: $framework"
            fi
        fi
    done
}

# Function to validate website reference comments
validate_website_comments() {
    echo -e "${BLUE}Checking Website Reference Comments...${NC}"
    
    local md_files=($(find "$PROJECT_ROOT" -name "*.md" -not -path "*/website/*" -not -path "*/.git/*"))
    
    for file in "${md_files[@]}"; do
        local relative_file=${file#$PROJECT_ROOT/}
        
        # Count website comments
        local comment_count=$(grep -c "<!-- .*https://matrix-protocol.org" "$file" 2>/dev/null || echo "0")
        
        if [[ "$comment_count" -gt 0 ]]; then
            pass_check "Has website comments: $relative_file ($comment_count comments)"
            
            # Check for proper comment format
            while IFS= read -r line; do
                if [[ ! "$line" =~ <!--[[:space:]].+:[[:space:]]https://matrix-protocol\.org.+[[:space:]]--> ]]; then
                    warn_check "Malformed website comment in $relative_file: $line"
                fi
            done < <(grep "<!-- .*https://matrix-protocol.org" "$file" 2>/dev/null || true)
        else
            # Only warn for main framework files
            if [[ "$relative_file" =~ ^(MATRIX_PROTOCOL|MEF_|ZOF_|OIF_|MOC_|MAL_|MEP_).*.md$ ]]; then
                warn_check "No website comments: $relative_file"
            fi
        fi
    done
}

# Function to check directory structure consistency
validate_directory_structure() {
    echo -e "${BLUE}Checking Directory Structure...${NC}"
    
    local required_dirs=(
        "guides"
        "examples"
        "templates"
        "visualizations"
        "scripts"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [[ -d "$PROJECT_ROOT/$dir" ]]; then
            pass_check "Directory exists: $dir"
        else
            fail_check "Missing required directory: $dir"
        fi
    done
    
    # Check for expected files in guides
    local guide_files=(
        "guides/QUICK_START.md"
        "guides/IMPLEMENTATION_ROADMAP.md"
        "guides/COMMON_PITFALLS.md"
    )
    
    for guide in "${guide_files[@]}"; do
        check_file_exists "$guide" "Phase 2 Implementation" "N/A"
    done
    
    # Check for template files
    local template_dirs=(
        "templates/moc"
        "templates/uki"
    )
    
    for template_dir in "${template_dirs[@]}"; do
        if [[ -d "$PROJECT_ROOT/$template_dir" ]]; then
            pass_check "Template directory exists: $template_dir"
            
            # Check if directory has content
            if [[ -n "$(ls -A "$PROJECT_ROOT/$template_dir" 2>/dev/null)" ]]; then
                pass_check "Template directory has content: $template_dir"
            else
                warn_check "Template directory is empty: $template_dir"
            fi
        else
            fail_check "Missing template directory: $template_dir"
        fi
    done
}

# Function to check version consistency
validate_version_consistency() {
    echo -e "${BLUE}Checking Version Consistency...${NC}"
    
    local md_files=($(find "$PROJECT_ROOT" -name "*.md" -not -path "*/website/*" -not -path "*/.git/*"))
    local expected_version="0.0.1"
    local expected_status="Beta"
    
    for file in "${md_files[@]}"; do
        local relative_file=${file#$PROJECT_ROOT/}
        
        # Skip files that don't need version headers
        if [[ "$relative_file" =~ ^(README|NAVIGATION_MAP|LINK_PATTERNS|SYNC_GUIDE|CONSOLIDATION_PLAN|WEBSITE_DIVERGENCE_ANALYSIS|PHASE_2_CONSOLIDATION_REPORT).md$ ]]; then
            continue
        fi
        
        # Check for version line
        local version_line=$(grep "^\*\*Version:\*\*" "$file" 2>/dev/null || echo "")
        if [[ -n "$version_line" ]]; then
            if [[ "$version_line" =~ $expected_version ]]; then
                pass_check "Correct version in: $relative_file"
            else
                fail_check "Incorrect version in: $relative_file ($version_line)"
            fi
        else
            warn_check "No version header in: $relative_file"
        fi
        
        # Check for status line (except MAL which should be Active)
        local status_line=$(grep "^\*\*Status:\*\*" "$file" 2>/dev/null || echo "")
        if [[ -n "$status_line" ]]; then
            if [[ "$relative_file" =~ MAL.*\.md$ ]]; then
                if [[ "$status_line" =~ "Active" ]]; then
                    pass_check "Correct status (Active) in: $relative_file"
                else
                    fail_check "Incorrect status in MAL file: $relative_file ($status_line)"
                fi
            else
                if [[ "$status_line" =~ $expected_status ]]; then
                    pass_check "Correct status in: $relative_file"
                else
                    fail_check "Incorrect status in: $relative_file ($status_line)"
                fi
            fi
        else
            warn_check "No status header in: $relative_file"
        fi
    done
}

# Main execution
main() {
    cd "$PROJECT_ROOT"
    
    echo "Starting validation..."
    echo ""
    
    validate_internal_links
    echo ""
    
    validate_navigation_map
    echo ""
    
    validate_framework_references
    echo ""
    
    validate_website_comments
    echo ""
    
    validate_directory_structure
    echo ""
    
    validate_version_consistency
    echo ""
    
    # Summary
    echo -e "${BLUE}Validation Summary${NC}"
    echo -e "${BLUE}=================${NC}"
    echo -e "Total Checks: $TOTAL_CHECKS"
    echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
    echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
    echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
    echo ""
    
    if [[ $FAILED_CHECKS -eq 0 ]]; then
        echo -e "${GREEN}✓ All critical checks passed!${NC}"
        if [[ $WARNING_CHECKS -gt 0 ]]; then
            echo -e "${YELLOW}⚠ $WARNING_CHECKS warnings need attention${NC}"
            exit 1
        else
            exit 0
        fi
    else
        echo -e "${RED}✗ $FAILED_CHECKS critical issues found${NC}"
        exit 2
    fi
}

# Help function
show_help() {
    echo "Matrix Protocol Cross-Reference Validator"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message"
    echo "  -v, --verbose Enable verbose output"
    echo ""
    echo "Exit codes:"
    echo "  0 - All checks passed"
    echo "  1 - Warnings found (non-critical)"
    echo "  2 - Critical issues found"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            set -x
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main