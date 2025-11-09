# 🧩 Guía de Sincronización MCP a Producción
## ORUS ModelScope Agent - Módulos MCP

## 🎯 Objetivo
Subir los módulos desarrollados localmente al entorno productivo de ORUS en el servidor `/opt/modelscope-agent/`.

## 📍 Estructura de Destino
```
/opt/modelscope-agent/mcp/
├── txt-reader/
│   ├── __init__.py
│   ├── reader_txt.py
│   ├── test.txt
│   └── README.md
└── log-analyzer/
    ├── __init__.py
    ├── log_analyzer.py
    ├── README.md
    └── test_logs/
        └── test.log
```

## 🚀 Proceso de Instalación

### 1. 📥 Descargar el Proyecto
```bash
# Clonar versión específica
git clone --branch v2.0.1 https://github.com/arrobatouch/teccia-z.git

# O actualizar a la última versión
cd teccia-z
git fetch --all --tags
git checkout v2.0.1
```

### 2. 🔧 Ejecutar Script de Sincronización
```bash
# Hacer ejecutable el script
chmod +x sync_mcp_to_production.sh

# Ejecutar como root
sudo ./sync_mcp_to_production.sh
```

### 3. 🧪 Verificación Manual (Opcional)
```bash
# Verificar módulos instalados
ls -lh /opt/modelscope-agent/mcp/

# Verificar contenido de cada módulo
ls -la /opt/modelscope-agent/mcp/txt-reader/
ls -la /opt/modelscope-agent/mcp/log-analyzer/

# Probar funcionalidad
python3 /opt/modelscope-agent/mcp/txt-reader/reader_txt.py
python3 /opt/modelscope-agent/mcp/log-analyzer/log_analyzer.py
```

## 📋 Pasos Manuales (Alternativa)

Si prefieres ejecutar los pasos manualmente:

### 1. 📂 Verificar Carpetas Locales
```bash
find ~/teccia-z -type d -name "txt-reader" -o -name "log-analyzer"
```

### 2. 📦 Copiar Módulos a Producción
```bash
# Copiar todos los módulos MCP
sudo cp -r ~/teccia-z/opt/modelscope-agent/mcp/* /opt/modelscope-agent/mcp/
```

### 3. 🔐 Ajustar Permisos
```bash
# Cambiar ownership
sudo chown -R root:root /opt/modelscope-agent/mcp/

# Establecer permisos
sudo chmod -R 755 /opt/modelscope-agent/mcp/

# Permisos específicos para archivos Python
sudo find /opt/modelscope-agent/mcp/ -name "*.py" -exec chmod 644 {} \;
```

### 4. 🧪 Verificar Instalación
```bash
# Listar módulos instalados
ls -lh /opt/modelscope-agent/mcp/

# Confirmar módulos activos
sudo ls -la /opt/modelscope-agent/mcp/txt-reader/
sudo ls -la /opt/modelscope-agent/mcp/log-analyzer/
```

## 🧠 Notas Técnicas

### ⚠️ Restricciones Importantes
- ❌ **NO MODIFICAR** el núcleo del sistema en `/opt/modelscope-agent/ms_agent/`
- ✅ Cada módulo MCP funciona de forma independiente
- ✅ Los módulos solo leen, no modifican archivos del sistema

### 📦 Gestión de Dependencias
Si un módulo requiere dependencias nuevas:
```bash
# Activar entorno virtual
source /opt/modelscope-agent/venv/bin/activate

# Instalar paquete
pip install <paquete>

# Desactivar
deactivate
```

### 🔄 Reinicio de Servicios
Después de sincronizar módulos:
```bash
# Reiniciar servicio ORUS
pm2 restart orus-modelscope

# Verificar estado
pm2 status
pm2 logs orus-modelscope
```

## 🧪 Testing Post-Instalación

### 1. 📄 Probar TXT Reader
```bash
cd /opt/modelscope-agent/mcp/txt-reader
python3 reader_txt.py
```

### 2. 📊 Probar Log Analyzer
```bash
cd /opt/modelscope-agent/mcp/log-analyzer
python3 log_analyzer.py

# Con logs de prueba
python3 -c "
from log_analyzer import LogAnalyzer
analyzer = LogAnalyzer(lines_limit=10)
result = analyzer.analyze_all_logs()
print(analyzer.get_summary(result))
"
```

### 3. 🔌 Probar Endpoints API
```bash
# Probar endpoint /logs
curl -s http://127.0.0.1:8085/logs | jq

# Probar endpoint /time
curl -s http://127.0.0.1:8085/time | jq
```

## 🔍 Troubleshooting

### ❌ Error: Permiso denegado
```bash
# Asegurarse de ejecutar con sudo
sudo ./sync_mcp_to_production.sh

# O ajustar permisos manualmente
sudo chown -R root:root /opt/modelscope-agent/mcp/
sudo chmod -R 755 /opt/modelscope-agent/mcp/
```

### ❌ Error: Módulo no encontrado
```bash
# Verificar instalación
ls -la /opt/modelscope-agent/mcp/

# Verificar archivos Python
find /opt/modelscope-agent/mcp/ -name "*.py" -ls
```

### ❌ Error: Import fallida
```bash
# Verificar PYTHONPATH
export PYTHONPATH=$PYTHONPATH:/opt/modelscope-agent/mcp/

# Probar import
python3 -c "import sys; sys.path.append('/opt/modelscope-agent/mcp/log-analyzer'); from log_analyzer import LogAnalyzer; print('✅ Import exitosa')"
```

## 📊 Módulos Esperados

Después de la sincronización, deberías ver:

```
/opt/modelscope-agent/mcp/
├── txt-reader/          ✅ Lector de archivos TXT
├── log-analyzer/        ✅ Analizador de logs
├── pdf-reader/          ✅ (Si existe) Lector de PDF
└── otros-módulos/       ✅ Módulos adicionales
```

## 🔄 Mantenimiento

### 💾 Sistema de Backup Mejorado v2.0.1

El script ahora incluye un sistema de backup robusto con las siguientes características:

#### 📁 Directorio de Backups Dedicado
- **Ruta**: `/opt/modelscope-agent/backups/`
- **Formato**: `mcp_backup_YYYY-MM-DD_HH-MM-SS`
- **Permisos**: root:root con 755

#### 📋 Registro Detallado en Log
- **Archivo**: `/var/log/mcp_sync.log`
- **Formato específico**: 
  ```
  [2025-11-09 12:45:30] BACKUP_EXITOSO: /opt/modelscope-agent/backups/mcp_backup_2025-11-09_12-45-30 (15 archivos)
  [2025-11-09 12:45:31] INFO_BACKUP: Directorio vacío, no se requiere backup
  [2025-11-09 12:45:32] ERROR_BACKUP: Falló creación en /opt/modelscope-agent/backups/mcp_backup_2025-11-09_12-45-32
  ```

#### 📊 Estadísticas Completas
- **Conteo de archivos**: Número exacto de archivos respaldados
- **Conteo de directorios**: Estructura completa respaldada
- **Espacio utilizado**: Tamaño total del backup
- **Historial**: Lista de últimos 5 backups

#### 🔄 Proceso de Backup Automático
1. **Verificación**: Directorio base de backups
2. **Creación**: Directorio con timestamp único
3. **Copia**: Todo el contenido de `/opt/modelscope-agent/mcp/`
4. **Validación**: Verificación de integridad del backup
5. **Registro**: Log detallado con formato específico
6. **Estadísticas**: Archivos, directorios y espacio
7. **Listado**: Backups recientes disponibles

### Actualización de Módulos
```bash
# 1. Descargar nueva versión
git checkout v2.0.1  # versión mejorada

# 2. Sincronizar con backup automático
sudo ./sync_mcp_to_production.sh

# 3. Verificar instalación
sudo ./verify_mcp_installation.sh

# 4. Reiniciar servicios
pm2 restart orus-modelscope
```

### Restauración desde Backup
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

## 📞 Soporte

- **Logs**: `/var/log/mcp_sync.log`
- **Backup**: `/opt/modelscope-agent/mcp_backup_*`
- **Reportes**: `/tmp/mcp_sync_report_*`

---

**🚀 Una vez completada la sincronización, los módulos MCP estarán listos para producción en el entorno ORUS.**