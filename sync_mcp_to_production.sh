#!/bin/bash
#
# 🧩 SCRIPT DE SINCRONIZACIÓN MCP A PRODUCCIÓN
# ORUS ModelScope Agent - Módulos MCP
#
# Uso: sudo ./sync_mcp_to_production.sh
#

set -e  # Detener en caso de error

# 🎨 Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 📍 Variables de configuración
SOURCE_DIR="/home/z/my-project/opt/modelscope-agent/mcp"
PROD_DIR="/opt/modelscope-agent/mcp"
BACKUP_DIR="/opt/modelscope-agent/mcp_backup_$(date +%Y%m%d_%H%M%S)"
LOG_FILE="/var/log/mcp_sync.log"

# 🧠 Funciones de utilidad
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$LOG_FILE"
}

# 🔍 Verificar permisos de root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "Este script debe ejecutarse como root (sudo)"
        echo -e "${YELLOW}Uso: sudo $0${NC}"
        exit 1
    fi
}

# 📂 Verificar directorio fuente
check_source() {
    if [[ ! -d "$SOURCE_DIR" ]]; then
        error "Directorio fuente no encontrado: $SOURCE_DIR"
        echo -e "${BLUE}Asegúrate de que el proyecto esté clonado en /home/z/my-project/${NC}"
        exit 1
    fi
}

# 🗂️ Verificar directorio de producción
check_production() {
    if [[ ! -d "$PROD_DIR" ]]; then
        warn "Directorio de producción no existe: $PROD_DIR"
        log "Creando directorio de producción..."
        mkdir -p "$PROD_DIR"
    fi
}

# 💾 Crear backup antes de sincronizar
create_backup() {
    if [[ -d "$PROD_DIR" ]] && [[ "$(ls -A $PROD_DIR 2>/dev/null)" ]]; then
        log "🔄 Creando backup en: $BACKUP_DIR"
        cp -r "$PROD_DIR" "$BACKUP_DIR"
        log "✅ Backup creado exitosamente"
    else
        log "📁 Directorio de producción vacío, no se requiere backup"
    fi
}

# 📦 Sincronizar módulos
sync_modules() {
    log "🚀 Iniciando sincronización de módulos MCP..."
    
    # Contar módulos a sincronizar
    MODULE_COUNT=$(find "$SOURCE_DIR" -maxdepth 1 -type d ! -path "$SOURCE_DIR" | wc -l)
    log "📊 Se encontraron $MODULE_COUNT módulos para sincronizar"
    
    # Listar módulos encontrados
    log "📋 Módulos a sincronizar:"
    for module in "$SOURCE_DIR"/*; do
        if [[ -d "$module" ]]; then
            module_name=$(basename "$module")
            log "   • $module_name"
        fi
    done
    
    # Sincronizar cada módulo
    for module_dir in "$SOURCE_DIR"/*; do
        if [[ -d "$module_dir" ]]; then
            module_name=$(basename "$module_dir")
            target_dir="$PROD_DIR/$module_name"
            
            log "📦 Sincronizando módulo: $module_name"
            
            # Eliminar versión anterior si existe
            if [[ -d "$target_dir" ]]; then
                log "   🗑️  Eliminando versión anterior de $module_name"
                rm -rf "$target_dir"
            fi
            
            # Copiar nueva versión
            log "   📋 Copiando archivos de $module_name"
            cp -r "$module_dir" "$target_dir"
            
            # Verificar copia
            if [[ -d "$target_dir" ]]; then
                log "   ✅ $module_name sincronizado exitosamente"
            else
                error "   ❌ Falló la sincronización de $module_name"
                return 1
            fi
        fi
    done
    
    log "🎉 Todos los módulos sincronizados exitosamente"
}

# 🔐 Ajustar permisos
set_permissions() {
    log "🔐 Ajustando permisos en $PROD_DIR"
    
    # Cambiar ownership
    chown -R root:root "$PROD_DIR"
    log "   ✅ Ownership cambiado a root:root"
    
    # Establecer permisos
    chmod -R 755 "$PROD_DIR"
    log "   ✅ Permisos establecidos a 755"
    
    # Asegurar que los scripts sean ejecutables
    find "$PROD_DIR" -name "*.py" -exec chmod 644 {} \;
    find "$PROD_DIR" -name "*.sh" -exec chmod 755 {} \; 2>/dev/null || true
    log "   ✅ Permisos de archivos ajustados"
}

# 🧪 Verificar instalación
verify_installation() {
    log "🧪 Verificando instalación..."
    
    if [[ ! -d "$PROD_DIR" ]]; then
        error "Directorio de producción no existe después de sincronización"
        return 1
    fi
    
    # Contar módulos instalados
    INSTALLED_COUNT=$(find "$PROD_DIR" -maxdepth 1 -type d ! -path "$PROD_DIR" | wc -l)
    log "📊 Módulos instalados: $INSTALLED_COUNT"
    
    # Verificar cada módulo
    for module_dir in "$PROD_DIR"/*; do
        if [[ -d "$module_dir" ]]; then
            module_name=$(basename "$module_dir")
            
            # Verificar archivos principales
            if [[ -f "$module_dir/__init__.py" ]] || [[ -f "$module_dir"/*.py ]]; then
                log "   ✅ $module_name - Archivos principales encontrados"
            else
                warn "   ⚠️  $module_name - No se encontraron archivos Python"
            fi
            
            # Contar archivos
            file_count=$(find "$module_dir" -type f | wc -l)
            log "   📄 $module_name - $file_count archivos"
        fi
    done
    
    log "✅ Verificación completada"
}

# 🧹 Limpiar archivos temporales
cleanup() {
    log "🧹 Limpiando archivos temporales..."
    
    # Eliminar __pycache__ directories
    find "$PROD_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    log "   🗑️  Archivos __pycache__ eliminados"
    
    # Eliminar archivos .pyc
    find "$PROD_DIR" -name "*.pyc" -delete 2>/dev/null || true
    log "   🗑️  Archivos .pyc eliminados"
    
    log "✅ Limpieza completada"
}

# 📋 Generar reporte final
generate_report() {
    log "📋 Generando reporte de sincronización..."
    
    REPORT_FILE="/tmp/mcp_sync_report_$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
🧩 REPORTE DE SINCRONIZACIÓN MCP A PRODUCCIÓN
============================================
Fecha: $(date)
Usuario: $(whoami)
Servidor: $(hostname)

📊 ESTADÍSTICAS:
- Módulos sincronizados: $(find "$PROD_DIR" -maxdepth 1 -type d ! -path "$PROD_DIR" | wc -l)
- Backup creado: $BACKUP_DIR
- Log file: $LOG_FILE

📦 MÓDULOS INSTALADOS:
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
- Directorios: 755
- Archivos Python: 644
- Owner: root:root

📝 LOG DE CAMBIOS:
$(tail -20 "$LOG_FILE")

============================================
Fin del reporte
EOF
    
    log "📄 Reporte generado: $REPORT_FILE"
    cat "$REPORT_FILE"
}

# 🚀 Función principal
main() {
    echo -e "${BLUE}"
    echo "🧩 ORUS MCP - SINCRONIZACIÓN A PRODUCCIÓN"
    echo "============================================"
    echo -e "${NC}"
    
    # Crear log file
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
    
    # Ejecutar pasos
    check_root
    check_source
    check_production
    create_backup
    sync_modules
    set_permissions
    cleanup
    verify_installation
    generate_report
    
    echo -e "${GREEN}"
    echo "🎉 SINCRONIZACIÓN COMPLETADA EXITOSAMENTE"
    echo "============================================"
    echo -e "${NC}"
    
    log "✅ Proceso de sincronización finalizado"
}

# 🔄 Manejo de errores
trap 'error "Script interrumpido"; exit 1' INT TERM

# 🚀 Ejecutar función principal
main "$@"