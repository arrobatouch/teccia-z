# 📦 PAQUETE DE SINCRONIZACIÓN MCP A PRODUCCIÓN v2.0.1

## 🎯 Objetivo
Sincronizar los módulos MCP desarrollados localmente al entorno productivo de ORUS.

## 🔄 MEJORAS v2.0.1 - SISTEMA DE BACKUP MEJORADO

### 💾 Características de Backup Robusto
- **Directorio dedicado**: `/opt/modelscope-agent/backups/`
- **Timestamp específico**: `mcp_backup_YYYY-MM-DD_HH-MM-SS`
- **Registro detallado**: Log específico en `/var/log/mcp_sync.log`
- **Estadísticas completas**: Conteo de archivos y directorios
- **Espacio utilizado**: Información del tamaño del backup
- **Permisos seguros**: root:root con 755
- **Historial de backups**: Lista de últimos 5 backups

### 📋 Formato de Log de Backup
```
[2025-11-09 12:45:30] BACKUP_EXITOSO: /opt/modelscope-agent/backups/mcp_backup_2025-11-09_12-45-30 (15 archivos)
[2025-11-09 12:45:31] INFO_BACKUP: Directorio vacío, no se requiere backup
[2025-11-09 12:45:32] ERROR_BACKUP: Falló creación en /opt/modelscope-agent/backups/mcp_backup_2025-11-09_12-45-32
```

### 🔄 Proceso de Backup Automático
1. **Verificación**: Directorio base de backups
2. **Creación**: Directorio con timestamp único
3. **Copia**: Todo el contenido de `/opt/modelscope-agent/mcp/`
4. **Validación**: Verificación de integridad del backup
5. **Registro**: Log detallado con formato específico
6. **Estadísticas**: Archivos, directorios y espacio
7. **Listado**: Backups recientes disponibles

### 🚀 Proceso de Restauración
Si algo falla durante la actualización:
```bash
# 1. Listar backups disponibles
ls -la /opt/modelscope-agent/backups/

# 2. Restaurar backup específico
sudo rm -rf /opt/modelscope-agent/mcp/*
sudo cp -r /opt/modelscope-agent/backups/mcp_backup_2025-11-09_12-45-30/* /opt/modelscope-agent/mcp/

# 3. Ajustar permisos
sudo chown -R root:root /opt/modelscope-agent/mcp/
sudo chmod -R 755 /opt/modelscope-agent/mcp/

# 4. Reiniciar servicios
pm2 restart orus-modelscope
```

## 📁 Archivos Creados

### 1. 🚀 Script Principal
- **Archivo**: `sync_mcp_to_production.sh`
- **Función**: Sincronización automatizada de módulos MCP a producción
- **Uso**: `sudo ./sync_mcp_to_production.sh`

### 2. 📖 Documentación Completa
- **Archivo**: `MCP_SYNC_GUIDE.md`
- **Función**: Guía detallada de instalación y troubleshooting
- **Contenido**: Pasos manuales, automatizados, testing y mantenimiento

### 3. 🧪 Script de Verificación
- **Archivo**: `verify_mcp_installation.sh`
- **Función**: Verificación post-instalación de módulos MCP
- **Uso**: `sudo ./verify_mcp_installation.sh`

## 🧠 Módulos MCP Desarrollados

### ✅ txt-reader
- **Ruta**: `/opt/modelscope-agent/mcp/txt-reader/`
- **Función**: Lectura segura de archivos .txt
- **Archivos**: `reader_txt.py`, `test.txt`, `__init__.py`

### ✅ log-analyzer
- **Ruta**: `/opt/modelscope-agent/mcp/log-analyzer/`
- **Función**: Análisis avanzado de logs del sistema
- **Archivos**: `log_analyzer.py`, `README.md`, `__init__.py`, `test_logs/`

## 🚀 Proceso de Sincronización

### Opción 1: Automatizada (Recomendada)
```bash
# 1. Descargar proyecto v1.9.0
git clone --branch v1.9.0 https://github.com/arrobatouch/teccia-z.git
cd teccia-z

# 2. Ejecutar sincronización
sudo ./sync_mcp_to_production.sh

# 3. Verificar instalación
sudo ./verify_mcp_installation.sh
```

### Opción 2: Manual
```bash
# 1. Copiar módulos
sudo cp -r ~/teccia-z/opt/modelscope-agent/mcp/* /opt/modelscope-agent/mcp/

# 2. Ajustar permisos
sudo chown -R root:root /opt/modelscope-agent/mcp/
sudo chmod -R 755 /opt/modelscope-agent/mcp/

# 3. Verificar
sudo ./verify_mcp_installation.sh
```

## 🔧 Características de los Scripts

### sync_mcp_to_production.sh
- ✅ **Backup automático** antes de cambios
- ✅ **Verificación de permisos** root
- ✅ **Sincronización inteligente** de módulos
- ✅ **Ajuste automático de permisos**
- ✅ **Limpieza de archivos temporales**
- ✅ **Generación de reportes**
- ✅ **Logging completo** de operaciones

### verify_mcp_installation.sh
- ✅ **Verificación de estructura** de directorios
- ✅ **Validación de archivos** principales
- ✅ **Testing funcional** de módulos
- ✅ **Verificación de permisos**
- ✅ **Integración con API ORUS**
- ✅ **Reporte detallado** de resultados

## 📊 Estado Actual

### Módulos Locales Verificados
- ✅ txt-reader: Funcional y documentado
- ✅ log-analyzer: Completo con API integrada

### Scripts Creados
- ✅ sync_mcp_to_production.sh: Listo para producción
- ✅ verify_mcp_installation.sh: Verificación completa
- ✅ MCP_SYNC_GUIDE.md: Documentación exhaustiva

### Próximos Pasos
1. 🚀 **Ejecutar en servidor de producción**
2. 🧪 **Verificar funcionamiento**
3. 🔄 **Reiniciar servicios ORUS**
4. 📊 **Validar endpoints API**

## 🎯 Resultado Esperado

Después de la sincronización, el entorno de producción tendrá:

```
/opt/modelscope-agent/mcp/
├── txt-reader/          ✅ Lector de archivos TXT
│   ├── __init__.py
│   ├── reader_txt.py
│   └── test.txt
└── log-analyzer/        ✅ Analizador de logs
    ├── __init__.py
    ├── log_analyzer.py
    ├── README.md
    └── test_logs/
        └── test.log
```

## 🔗 Endpoints API Disponibles

- **GET /logs**: Análisis de logs en tiempo real
- **GET /time**: Hora actual del servidor
- **POST /query**: Consultas a ORUS

## 📞 Soporte y Troubleshooting

- **Logs de sincronización**: `/var/log/mcp_sync.log`
- **Reportes de verificación**: `/tmp/mcp_verification_report_*`
- **Backups automáticos**: `/opt/modelscope-agent/mcp_backup_*`

---

**🚀 Los módulos MCP están listos para sincronización a producción!**