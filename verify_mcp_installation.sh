#!/bin/bash
#
# 🧪 SCRIPT DE VERIFICACIÓN POST-INSTALACIÓN MCP
# ORUS ModelScope Agent - Verificación de Módulos MCP
#
# Uso: sudo ./verify_mcp_installation.sh
#

set -e

# 🎨 Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 📍 Variables
PROD_DIR="/opt/modelscope-agent/mcp"
REPORT_FILE="/tmp/mcp_verification_report_$(date +%Y%m%d_%H%M%S).txt"
ERRORS=0
WARNINGS=0

# 🧠 Funciones
log() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 🔍 Verificar permisos de root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "Este script debe ejecutarse como root (sudo)"
        echo -e "${YELLOW}Uso: sudo $0${NC}"
        exit 1
    fi
}

# 📂 Verificar directorio MCP
check_mcp_directory() {
    info "Verificando directorio MCP..."
    
    if [[ ! -d "$PROD_DIR" ]]; then
        error "Directorio MCP no existe: $PROD_DIR"
        return 1
    fi
    
    log "Directorio MCP encontrado: $PROD_DIR"
    
    # Verificar permisos
    DIR_PERMS=$(stat -c "%a" "$PROD_DIR")
    DIR_OWNER=$(stat -c "%U:%G" "$PROD_DIR")
    
    if [[ "$DIR_PERMS" != "755" ]]; then
        warn "Permisos incorrectos en $PROD_DIR: $DIR_PERMS (esperado: 755)"
    else
        log "Permisos correctos en directorio MCP: $DIR_PERMS"
    fi
    
    if [[ "$DIR_OWNER" != "root:root" ]]; then
        warn "Owner incorrecto en $PROD_DIR: $DIR_OWNER (esperado: root:root)"
    else
        log "Owner correcto en directorio MCP: $DIR_OWNER"
    fi
}

# 📦 Verificar módulos instalados
check_modules() {
    info "Verificando módulos instalados..."
    
    if [[ ! -d "$PROD_DIR" ]] || [[ -z "$(ls -A $PROD_DIR 2>/dev/null)" ]]; then
        error "No se encontraron módulos en $PROD_DIR"
        return 1
    fi
    
    MODULE_COUNT=0
    for module_dir in "$PROD_DIR"/*; do
        if [[ -d "$module_dir" ]]; then
            module_name=$(basename "$module_dir")
            ((MODULE_COUNT++))
            
            log "Módulo encontrado: $module_name"
            
            # Verificar archivos principales
            check_module_files "$module_name" "$module_dir"
        fi
    done
    
    if [[ $MODULE_COUNT -eq 0 ]]; then
        error "No se encontraron módulos válidos"
        return 1
    fi
    
    log "Total de módulos encontrados: $MODULE_COUNT"
}

# 📄 Verificar archivos de cada módulo
check_module_files() {
    local module_name="$1"
    local module_dir="$2"
    
    # Contar archivos
    FILE_COUNT=$(find "$module_dir" -type f | wc -l)
    PY_FILES=$(find "$module_dir" -name "*.py" | wc -l)
    
    log "  📄 $module_name: $FILE_COUNT archivos ($PY_FILES Python)"
    
    # Verificar __init__.py
    if [[ -f "$module_dir/__init__.py" ]]; then
        log "  ✅ $module_name: __init__.py encontrado"
    else
        warn "  ⚠️  $module_name: No se encontró __init__.py"
    fi
    
    # Verificar archivos Python principales
    if [[ $PY_FILES -eq 0 ]]; then
        warn "  ⚠️  $module_name: No se encontraron archivos Python"
    else
        log "  ✅ $module_name: $PY_FILES archivos Python encontrados"
    fi
    
    # Verificar permisos de archivos
    check_file_permissions "$module_name" "$module_dir"
    
    # Verificar módulos específicos
    check_specific_module "$module_name" "$module_dir"
}

# 🔐 Verificar permisos de archivos
check_file_permissions() {
    local module_name="$1"
    local module_dir="$2"
    
    # Verificar permisos de archivos Python
    find "$module_dir" -name "*.py" | while read -r py_file; do
        file_perms=$(stat -c "%a" "$py_file")
        if [[ "$file_perms" != "644" ]]; then
            warn "  ⚠️  $module_name: Permisos incorrectos en $(basename "$py_file"): $file_perms"
        fi
    done
}

# 🧪 Verificar módulos específicos
check_specific_module() {
    local module_name="$1"
    local module_dir="$2"
    
    case "$module_name" in
        "txt-reader")
            check_txt_reader "$module_dir"
            ;;
        "log-analyzer")
            check_log_analyzer "$module_dir"
            ;;
        *)
            info "  ℹ️  $module_name: Módulo genérico, sin verificación específica"
            ;;
    esac
}

# 📄 Verificar txt-reader
check_txt_reader() {
    local module_dir="$1"
    
    if [[ -f "$module_dir/reader_txt.py" ]]; then
        log "  ✅ txt-reader: reader_txt.py encontrado"
        
        # Probar funcionalidad básica
        cd "$module_dir"
        if python3 reader_txt.py > /dev/null 2>&1; then
            log "  ✅ txt-reader: Funciona correctamente"
        else
            warn "  ⚠️  txt-reader: Error en ejecución"
        fi
        cd - > /dev/null
    else
        error "  ❌ txt-reader: No se encontró reader_txt.py"
    fi
    
    if [[ -f "$module_dir/test.txt" ]]; then
        log "  ✅ txt-reader: test.txt encontrado"
    else
        warn "  ⚠️  txt-reader: No se encontró test.txt"
    fi
}

# 📊 Verificar log-analyzer
check_log_analyzer() {
    local module_dir="$1"
    
    if [[ -f "$module_dir/log_analyzer.py" ]]; then
        log "  ✅ log-analyzer: log_analyzer.py encontrado"
        
        # Probar import
        if python3 -c "
import sys
sys.path.append('$module_dir')
try:
    from log_analyzer import LogAnalyzer
    print('✅ Import exitosa')
except Exception as e:
    print(f'❌ Error de import: {e}')
    exit(1)
" 2>/dev/null; then
            log "  ✅ log-analyzer: Import exitosa"
        else
            warn "  ⚠️  log-analyzer: Error en import"
        fi
    else
        error "  ❌ log-analyzer: No se encontró log_analyzer.py"
    fi
    
    if [[ -f "$module_dir/README.md" ]]; then
        log "  ✅ log-analyzer: README.md encontrado"
    else
        warn "  ⚠️  log-analyzer: No se encontró README.md"
    fi
}

# 🌐 Verificar integración con API ORUS
check_api_integration() {
    info "Verificando integración con API ORUS..."
    
    # Verificar si el endpoint /logs está disponible
    if command -v curl >/dev/null 2>&1; then
        if curl -s http://127.0.0.1:8085/logs > /dev/null 2>&1; then
            log "✅ Endpoint /logs accesible"
        else
            warn "⚠️  Endpoint /logs no accesible"
        fi
    else
        warn "⚠️  curl no disponible para verificar API"
    fi
}

# 🧹 Verificar limpieza
check_cleanup() {
    info "Verificando limpieza de archivos temporales..."
    
    # Contar archivos __pycache__
    PYCACHE_COUNT=$(find "$PROD_DIR" -type d -name "__pycache__" | wc -l)
    if [[ $PYCACHE_COUNT -gt 0 ]]; then
        warn "⚠️  Se encontraron $PYCACHE_COUNT directorios __pycache__"
    else
        log "✅ No se encontraron directorios __pycache__"
    fi
    
    # Contar archivos .pyc
    PYC_COUNT=$(find "$PROD_DIR" -name "*.pyc" | wc -l)
    if [[ $PYC_COUNT -gt 0 ]]; then
        warn "⚠️  Se encontraron $PYC_COUNT archivos .pyc"
    else
        log "✅ No se encontraron archivos .pyc"
    fi
}

# 📋 Generar reporte
generate_report() {
    info "Generando reporte de verificación..."
    
    cat > "$REPORT_FILE" << EOF
🧪 REPORTE DE VERIFICACIÓN MCP
================================
Fecha: $(date)
Servidor: $(hostname)
Usuario: $(whoami)

📊 RESULTADOS:
- Errores: $ERRORS
- Advertencias: $WARNINGS
- Estado: $([ $ERRORS -eq 0 ] && echo "✅ EXITOSO" || echo "❌ CON ERRORES")

📦 MÓDULOS VERIFICADOS:
EOF
    
    for module_dir in "$PROD_DIR"/*; do
        if [[ -d "$module_dir" ]]; then
            module_name=$(basename "$module_dir")
            file_count=$(find "$module_dir" -type f | wc -l)
            echo "- $module_name ($file_count archivos)" >> "$REPORT_FILE"
        fi
    done
    
    cat >> "$REPORT_FILE" << EOF

🔍 PERMISOS:
- Directorio MCP: $(stat -c "%a %U:%G" "$PROD_DIR")
- Archivos Python: 644
- Directorios: 755

🌐 INTEGRACIÓN API:
- Endpoint /logs: $(curl -s http://127.0.0.1:8085/logs > /dev/null 2>&1 && echo "✅ Accesible" || echo "❌ No accesible")

================================
EOF
    
    log "📄 Reporte guardado en: $REPORT_FILE"
}

# 🚀 Función principal
main() {
    echo -e "${BLUE}"
    echo "🧪 VERIFICACIÓN POST-INSTALACIÓN MCP"
    echo "==================================="
    echo -e "${NC}"
    
    # Ejecutar verificaciones
    check_root
    check_mcp_directory
    check_modules
    check_api_integration
    check_cleanup
    generate_report
    
    # Resumen final
    echo -e "${BLUE}"
    echo "==================================="
    echo "📊 RESUMEN DE VERIFICACIÓN"
    echo "==================================="
    echo -e "${NC}"
    
    if [[ $ERRORS -eq 0 ]]; then
        if [[ $WARNINGS -eq 0 ]]; then
            log "🎉 VERIFICACIÓN COMPLETADA SIN ERRORES NI ADVERTENCIAS"
        else
            warn "⚠️  VERIFICACIÓN COMPLETADA CON $WARNINGS ADVERTENCIAS"
        fi
    else
        error "❌ VERIFICACIÓN COMPLETADA CON $ERRORS ERRORES (y $WARNINGS advertencias)"
    fi
    
    echo -e "${BLUE}Reporte detallado: $REPORT_FILE${NC}"
    
    # Exit code basado en errores
    exit $ERRORS
}

# 🚀 Ejecutar
main "$@"