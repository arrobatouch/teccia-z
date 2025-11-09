#!/usr/bin/env python3
"""
ORUS API - API REST para el sistema ORUS
Endpoints principales para consulta y gestión del sistema
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
import json
import sys
import os

# Agregar path del módulo log-analyzer
sys.path.append('/opt/modelscope-agent/mcp/log-analyzer')
try:
    from log_analyzer import LogAnalyzer
    LOG_ANALYZER_AVAILABLE = True
except ImportError:
    LOG_ANALYZER_AVAILABLE = False

app = FastAPI(
    title="ORUS API",
    description="API REST para el sistema ORUS",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """Endpoint principal"""
    return {
        "message": "ORUS API - Sistema Cognitivo Distribuido",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    """Verificar salud del sistema"""
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "ORUS-API",
        "version": "1.0.0"
    }

@app.post("/query")
def query_orus(data: dict):
    """Endpoint principal para consultas a ORUS"""
    try:
        text = data.get("text", "")
        source = data.get("source", "unknown")
        
        # Simulación de procesamiento (aquí iría la lógica real de ORUS)
        response_text = f"ORUS ha procesado: '{text}' desde {source}"
        
        return {
            "status": "ok",
            "message": response_text,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source": source
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

@app.get("/time")
def get_time():
    """Devuelve la hora actual del servidor."""
    return {"status": "ok", "server_time": datetime.utcnow().isoformat() + "Z"}

@app.get("/logs")
def get_logs_analysis():
    """Análisis de logs del sistema ORUS"""
    if not LOG_ANALYZER_AVAILABLE:
        return {
            "status": "error",
            "error": "Log analyzer module not available",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    
    try:
        analyzer = LogAnalyzer()
        result = analyzer.analyze_all_logs()
        
        return {
            "status": "ok",
            "timestamp": result["timestamp"],
            "errors_found": [error["content"] for error in result["errors_found"]],
            "total_errors": result["total_errors"],
            "analyzed_files": result["analyzed_files"],
            "skipped_files": result["skipped_files"]
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

@app.get("/analyzed-files")
def get_analyzed_files():
    """
    Endpoint para consultar archivos o textos analizados por ORUS
    Devuelve JSON con archivos procesados desde GitHub y logs analizados
    """
    try:
        analyzed_files = []
        
        # Leer datos de sincronización de GitHub
        github_sync_file = '/home/z/my-project/opt/modelscope-agent/data/github_sync.json'
        if os.path.exists(github_sync_file):
            with open(github_sync_file, 'r', encoding='utf-8') as f:
                github_data = json.load(f)
            
            for item in github_data:
                analyzed_files.append({
                    "file": item.get("file"),
                    "summary": item.get("summary"),
                    "date": item.get("updated"),
                    "source": "GitHub",
                    "word_count": item.get("word_count", 0),
                    "line_count": item.get("line_count", 0),
                    "file_size": item.get("file_size", 0),
                    "processed_at": item.get("processed_at")
                })
        
        # Leer datos de logs analizados (simulado para esta implementación)
        if LOG_ANALYZER_AVAILABLE:
            try:
                analyzer = LogAnalyzer()
                log_result = analyzer.analyze_all_logs()
                
                if log_result["total_errors"] > 0:
                    analyzed_files.append({
                        "file": "error_log.txt",
                        "summary": f"{log_result['total_errors']} errores críticos detectados y solucionados",
                        "date": log_result["timestamp"],
                        "source": "ORUS Log Analyzer",
                        "total_errors": log_result["total_errors"],
                        "analyzed_files": log_result["analyzed_files"],
                        "processed_at": log_result["timestamp"]
                    })
            except Exception as e:
                # Si hay error con el analizador, continuar sin datos de logs
                pass
        
        # Ordenar por fecha (más reciente primero)
        analyzed_files.sort(key=lambda x: x.get("date", ""), reverse=True)
        
        # Registrar auditoría
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "endpoint": "/analyzed-files",
            "files_returned": len(analyzed_files),
            "client_ip": "localhost"  # En producción se obtendría de la request
        }
        
        # Guardar log de auditoría
        audit_log_file = '/home/z/my-project/opt/modelscope-agent/logs/api_access.log'
        os.makedirs(os.path.dirname(audit_log_file), exist_ok=True)
        with open(audit_log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "total_files": len(analyzed_files),
            "files": analyzed_files,
            "sources": list(set([item.get("source") for item in analyzed_files]))
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8085)