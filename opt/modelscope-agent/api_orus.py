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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8085)