# 🧠 ORUS Log Analyzer

Módulo de análisis de logs para el sistema ORUS ModelScope Agent.

## 🎯 Objetivo

Detectar errores, excepciones y fallos recientes en los logs del sistema ORUS para facilitar el diagnóstico y mantenimiento.

## 📁 Estructura

```
/opt/modelscope-agent/mcp/log-analyzer/
├── __init__.py          # Inicialización del módulo
├── log_analyzer.py      # Funcionalidad principal
├── README.md           # Documentación
└── test_logs/          # Logs de prueba (opcional)
```

## 🔧 Funcionalidad

### Características Principales

- ✅ **Lectura no destructiva**: Solo lectura de archivos, sin modificar
- ✅ **Configurable**: Límite de líneas ajustable (por defecto: 100)
- ✅ **Múltiples patrones**: Detección de ERROR, Exception, Traceback, Failed, etc.
- ✅ **Múltiples directorios**: Soporte para PM2 y ModelScope logs
- ✅ **Reporte detallado**: Informe completo con timestamps y contexto

### Patrones de Error Detectados

- `ERROR`
- `Exception` 
- `Traceback`
- `Failed`
- `Refused`
- `Connection reset`
- `Timeout`
- `Error`
- `CRITICAL`
- `FATAL`

### Directorios Analizados

- `/root/.pm2/logs/` - Logs de PM2
- `/opt/modelscope-agent/logs/` - Logs del sistema ORUS

## 🚀 Uso

### Ejecución Manual

```bash
# Análisis básico
python3 /opt/modelscope-agent/mcp/log-analyzer/log_analyzer.py

# Guardar resultado en JSON
python3 /opt/modelscope-agent/mcp/log-analyzer/log_analyzer.py --json
```

### Uso Programático

```python
from log_analyzer import LogAnalyzer

# Crear analizador con configuración personalizada
analyzer = LogAnalyzer(
    log_dirs=["/custom/log/path/"],
    lines_limit=50
)

# Analizar todos los logs
result = analyzer.analyze_all_logs()

# Obtener resumen legible
summary = analyzer.get_summary(result)
print(summary)

# Acceder a errores específicos
for error in result['errors_found']:
    print(f"Archivo: {error['file']}")
    print(f"Error: {error['content']}")
```

## 📊 Salida Esperada

### Sin Errores
```
🕓 Análisis ejecutado: 2025-11-09T23:15:22Z
✅ No se detectaron errores recientes

📁 Archivos analizados: pm2.log, orus-modelscope-out.log
```

### Con Errores
```
🕓 Análisis ejecutado: 2025-11-09T23:15:22Z
🚨 Se encontraron 2 errores:
[orus-modelscope-error.log] ERROR: Connection refused
[teccia-realtime-out.log] Exception: Timeout while connecting

📁 Archivos analizados: pm2.log, orus-modelscope-error.log, teccia-realtime-out.log
```

## 🔍 Integración con API ORUS

El módulo puede integrarse como endpoint en la API ORUS:

```python
# En api_orus.py
from mcp.log_analyzer import LogAnalyzer

@app.get("/logs")
def get_logs_analysis():
    """Análisis de logs del sistema"""
    analyzer = LogAnalyzer()
    result = analyzer.analyze_all_logs()
    
    return {
        "status": "ok",
        "timestamp": result["timestamp"],
        "errors_found": [error["content"] for error in result["errors_found"]],
        "total_errors": result["total_errors"],
        "analyzed_files": result["analyzed_files"]
    }
```

## ⚙️ Configuración

### Parámetros Configurables

- `log_dirs`: Lista de directorios de logs a analizar
- `lines_limit`: Número de líneas a leer por archivo (defecto: 100)
- `error_patterns`: Patrones de error personalizados

### Ejemplo de Configuración Avanzada

```python
analyzer = LogAnalyzer(
    log_dirs=[
        "/root/.pm2/logs/",
        "/opt/modelscope-agent/logs/",
        "/var/log/nginx/"
    ],
    lines_limit=200
)
```

## 🛡️ Seguridad

- ✅ **Solo lectura**: No modifica archivos de log
- ✅ **Control de acceso**: Requiere permisos de lectura en directorios
- ✅ Manejo de errores**: Captura excepciones de lectura
- ✅ **Límites configurables**: Previene consumo excesivo de recursos

## 🧪 Testing

### Crear Logs de Prueba

```bash
mkdir -p test_logs
echo "INFO: Sistema iniciado correctamente" > test_logs/test.log
echo "ERROR: Conexión fallida a base de datos" >> test_logs/test.log
echo "Exception: Null pointer en módulo X" >> test_logs/test.log
```

### Ejecutar Pruebas

```bash
python3 -c "
from log_analyzer import LogAnalyzer
analyzer = LogAnalyzer(log_dirs=['test_logs/'])
result = analyzer.analyze_all_logs()
print(analyzer.get_summary(result))
"
```

## 📝 Versiones

- **v1.0.0**: Versión inicial con análisis básico
- Soporte para múltiples patrones de error
- Configuración flexible de directorios y límites
- Integración con API ORUS

## 👥 Desarrollo

**Equipo**: TECCIA-Z Development Team  
**Módulo**: ORUS ModelScope Agent - MCP  
**Categoría**: Herramientas de Diagnóstico