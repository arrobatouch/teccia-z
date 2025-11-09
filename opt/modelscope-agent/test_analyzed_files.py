#!/usr/bin/env python3
"""
🌐 Exportación a JSON API - Test del endpoint analyzed-files
Prueba del nuevo endpoint para consultar archivos analizados por ORUS
"""

import json
import os
from datetime import datetime

def test_analyzed_files_endpoint():
    """
    Simulación del endpoint /analyzed-files
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
        
        # Ordenar por fecha (más reciente primero)
        analyzed_files.sort(key=lambda x: x.get("date", ""), reverse=True)
        
        # Registrar auditoría
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "endpoint": "/analyzed-files",
            "files_returned": len(analyzed_files),
            "client_ip": "localhost"
        }
        
        # Guardar log de auditoría
        audit_log_file = '/home/z/my-project/opt/modelscope-agent/logs/api_access.log'
        os.makedirs(os.path.dirname(audit_log_file), exist_ok=True)
        with open(audit_log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        result = {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "total_files": len(analyzed_files),
            "files": analyzed_files,
            "sources": list(set([item.get("source") for item in analyzed_files]))
        }
        
        return result
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

def main():
    """Función principal para prueba"""
    print("🌐 Probando endpoint /analyzed-files...")
    
    result = test_analyzed_files_endpoint()
    
    print(f"✅ Resultado del endpoint:")
    print(json.dumps(result, indent=2))
    
    # Verificar que se cumplan los requisitos
    if result["status"] == "ok":
        print(f"\n📊 Estadísticas:")
        print(f"   Total archivos: {result['total_files']}")
        print(f"   Fuentes: {', '.join(result['sources'])}")
        
        if result['total_files'] >= 1:
            print(f"   ✅ Requisito cumplido: Al menos un objeto devuelto")
        else:
            print(f"   ❌ Requisito no cumplido: No hay archivos devueltos")
    else:
        print(f"❌ Error en el endpoint: {result.get('error')}")

if __name__ == "__main__":
    main()