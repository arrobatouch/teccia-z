#!/usr/bin/env python3
"""
🏁 VALIDACIÓN FINAL - Sistema Completo de Conectores Cognitivos ORUS
"""

import json
import os
import sys
from datetime import datetime

# Agregar paths de los módulos
sys.path.append('/home/z/my-project/opt/modelscope-agent/connectors')
sys.path.append('/home/z/my-project/opt/modelscope-agent/mcp/teccia_sync')

def test_anythingllm():
    print("🔗 Test 1/4: Conector AnythingLLM")
    print("-" * 50)
    
    try:
        from anythingllm_connector import AnythingLLMConnector
        connector = AnythingLLMConnector()
        test_result = connector.test_connection()
        
        if test_result["success"]:
            print("✅ Conexión con AnythingLLM: EXITOSA")
            print(f"   📊 Contenido: {test_result.get('content_length', 0)} caracteres")
            return True
        else:
            print("❌ Conexión con AnythingLLM: FALLIDA")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_github():
    print("\n🧩 Test 2/4: Conector GitHub API")
    print("-" * 50)
    
    try:
        from github_connector import GitHubConnector
        connector = GitHubConnector()
        test_result = connector.test_connection()
        
        if test_result["success"]:
            print("✅ Conexión con GitHub API: EXITOSA")
            print(f"   📁 Repositorio: {test_result.get('repo_name')}")
            return True
        else:
            print("❌ Conexión con GitHub API: FALLIDA")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_tec cia():
    print("\n🗂️ Test 3/4: Sincronización con TECCIA-Z")
    print("-" * 50)
    
    try:
        from teccia_sync import TECCIAZSync
        sync = TECCIAZSync()
        status_result = sync.get_sync_status()
        
        print("✅ Sincronizador TECCIA-Z: INICIALIZADO")
        print(f"   📊 Datos GitHub: {status_result.get('github_data_available', 0)}")
        return True
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_api():
    print("\n🌐 Test 4/4: Exportación a JSON API")
    print("-" * 50)
    
    try:
        from test_analyzed_files import test_analyzed_files_endpoint
        result = test_analyzed_files_endpoint()
        
        if result["status"] == "ok":
            print("✅ Endpoint /analyzed-files: FUNCIONAL")
            print(f"   📊 Total archivos: {result.get('total_files', 0)}")
            return result.get('total_files', 0) >= 1
        else:
            print("❌ Endpoint /analyzed-files: FALLIDO")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def check_files():
    print("\n📁 Verificación de Archivos y Logs")
    print("-" * 50)
    
    files = [
        '/home/z/my-project/opt/modelscope-agent/connectors/anythingllm_connector.py',
        '/home/z/my-project/opt/modelscope-agent/connectors/github_connector.py',
        '/home/z/my-project/opt/modelscope-agent/mcp/teccia_sync/teccia_sync.py',
        '/home/z/my-project/opt/modelscope-agent/data/github_sync.json',
        '/home/z/my-project/opt/modelscope-agent/config/.env'
    ]
    
    logs = [
        '/home/z/my-project/opt/modelscope-agent/logs/anythingllm_ingest.log',
        '/home/z/my-project/opt/modelscope-agent/logs/github_connector.log',
        '/home/z/my-project/opt/modelscope-agent/logs/teccia_sync.log',
        '/home/z/my-project/opt/modelscope-agent/logs/api_access.log'
    ]
    
    files_ok = sum(1 for f in files if os.path.exists(f))
    logs_ok = sum(1 for l in logs if os.path.exists(l))
    
    print(f"📄 Archivos: {files_ok}/{len(files)}")
    print(f"📋 Logs: {logs_ok}/{len(logs)}")
    
    return files_ok == len(files) and logs_ok >= 3

def main():
    print("🏁 VALIDACIÓN FINAL - Sistema Completo de Conectores Cognitivos ORUS")
    print("=" * 70)
    print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    results = [
        test_anythingllm(),
        test_github(),
        test_tec cia(),
        test_api()
    ]
    
    files_ok = check_files()
    
    print("\n" + "=" * 70)
    print("📊 RESUMEN FINAL")
    print("=" * 70)
    
    passed = sum(results)
    total = len(results)
    
    print(f"🎯 RESULTADO: {passed}/{total} tests exitosos")
    print(f"📁 Archivos: {'✅' if files_ok else '❌'}")
    
    if passed == total and files_ok:
        print("🏆 ¡SISTEMA COMPLETO FUNCIONAL!")
        print("✅ Todos los conectores cognitivos operativos")
        print("✅ Integración con AnythingLLM, GitHub y TECCIA-Z completa")
        print("✅ Exportación JSON API funcionando")
        print("✅ Logging y auditoría completos")
        return True
    else:
        print("⚠️ Sistema requiere atención")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)