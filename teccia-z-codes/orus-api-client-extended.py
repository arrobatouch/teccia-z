#!/usr/bin/env python3
"""
TECCIA-Z ORUS API Client - Extended Version
Cliente extendido con soporte para análisis de logs
"""

import urllib.request
import json
import sys
import time
from datetime import datetime

class ORUSAPIClient:
    def __init__(self, base_url: str = "http://127.0.0.1:8085"):
        self.base_url = base_url
    
    def query(self, text: str, source: str = "TECCIA-Z-Client") -> dict:
        """Enviar consulta a ORUS"""
        try:
            data = json.dumps({"text": text, "source": source})
            data = data.encode('utf-8')
            req = urllib.request.Request(f"{self.base_url}/query", data=data)
            req.add_header('Content-Type', 'application/json')
            req.add_header('User-Agent', 'TECCIA-Z-API-Client/1.0')
            
            with urllib.request.urlopen(req, timeout=10) as response:
                response_data = response.read().decode('utf-8')
                content_type = response.headers.get('Content-Type', '')
                is_json = content_type and content_type.startswith('application/json')
                
                return {
                    "success": response.getcode() == 200,
                    "status_code": response.getcode(),
                    "data": json.loads(response_data) if is_json else response_data,
                    "timestamp": datetime.now().isoformat(),
                    "endpoint": f"{self.base_url}/query"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "endpoint": f"{self.base_url}/query"
            }
    
    def health_check(self) -> dict:
        """Verificar salud del sistema ORUS"""
        try:
            req = urllib.request.Request(f"{self.base_url}/health")
            req.add_header('User-Agent', 'TECCIA-Z-API-Client/1.0')
            
            with urllib.request.urlopen(req, timeout=5) as response:
                response_data = response.read().decode('utf-8')
                content_type = response.headers.get('Content-Type', '')
                is_json = content_type and content_type.startswith('application/json')
                
                return {
                    "success": response.getcode() == 200,
                    "status_code": response.getcode(),
                    "data": json.loads(response_data) if is_json else response_data,
                    "timestamp": datetime.now().isoformat(),
                    "endpoint": f"{self.base_url}/health"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "endpoint": f"{self.base_url}/health"
            }
    
    def get_time(self) -> dict:
        """Obtener hora actual del servidor ORUS"""
        try:
            req = urllib.request.Request(f"{self.base_url}/time")
            req.add_header('User-Agent', 'TECCIA-Z-API-Client/1.0')
            
            with urllib.request.urlopen(req, timeout=5) as response:
                response_data = response.read().decode('utf-8')
                content_type = response.headers.get('Content-Type', '')
                is_json = content_type and content_type.startswith('application/json')
                
                return {
                    "success": response.getcode() == 200,
                    "status_code": response.getcode(),
                    "data": json.loads(response_data) if is_json else response_data,
                    "timestamp": datetime.now().isoformat(),
                    "endpoint": f"{self.base_url}/time"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "endpoint": f"{self.base_url}/time"
            }
    
    def get_logs_analysis(self) -> dict:
        """Obtener análisis de logs del sistema ORUS"""
        try:
            req = urllib.request.Request(f"{self.base_url}/logs")
            req.add_header('User-Agent', 'TECCIA-Z-API-Client/1.0')
            
            with urllib.request.urlopen(req, timeout=10) as response:
                response_data = response.read().decode('utf-8')
                content_type = response.headers.get('Content-Type', '')
                is_json = content_type and content_type.startswith('application/json')
                
                return {
                    "success": response.getcode() == 200,
                    "status_code": response.getcode(),
                    "data": json.loads(response_data) if is_json else response_data,
                    "timestamp": datetime.now().isoformat(),
                    "endpoint": f"{self.base_url}/logs"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "endpoint": f"{self.base_url}/logs"
            }

def print_response(response: dict, title: str = "Response"):
    """Formatear respuesta para mostrar"""
    print("\n" + "=" * 50)
    print("🔍 " + title)
    print("=" * 50)
    
    if response["success"]:
        print("✅ Éxito: " + str(response['status_code']))
        if "data" in response and isinstance(response["data"], dict):
            data = response["data"]
            
            if "message" in data:
                print("📄 Mensaje: " + data['message'])
            elif "errors_found" in data:
                print(f"🚨 Errores encontrados: {data.get('total_errors', 0)}")
                if data["errors_found"]:
                    for error in data["errors_found"]:
                        print(f"   • {error}")
                else:
                    print("   ✅ No se detectaron errores")
                
                if data.get("analyzed_files"):
                    print(f"📁 Archivos analizados: {', '.join(data['analyzed_files'])}")
                
                if data.get("skipped_files"):
                    print(f"⚠️  Archivos omitidos: {', '.join(data['skipped_files'])}")
            else:
                print("📄 Datos: " + json.dumps(data, indent=2, ensure_ascii=False))
    else:
        print("❌ Error: " + response.get('error', 'Unknown error'))
        if "status_code" in response:
            print("📊 Status Code: " + str(response['status_code']))
    
    print("🕐 Timestamp: " + response['timestamp'])
    print("🌐 Endpoint: " + response['endpoint'])
    print("=" * 50)

def main():
    if len(sys.argv) < 2:
        print("🔍 TECCIA-Z ORUS API Client - Extended Version")
        print("=" * 50)
        print("Uso:")
        print("  python3 orus-api-client-extended.py <comando>")
        print("")
        print("Comandos disponibles:")
        print("  health          - Verificar salud de ORUS")
        print("  time            - Hora actual del servidor")
        print("  logs            - Análisis de logs del sistema")
        print("  query <texto> - Enviar consulta personalizada")
        print("")
        print("Ejemplos:")
        print("  python3 orus-api-client-extended.py health")
        print("  python3 orus-api-client-extended.py time")
        print("  python3 orus-api-client-extended.py logs")
        print("  python3 orus-api-client-extended.py query 'ORUS, prueba'")
        print("=" * 50)
        sys.exit(1)
    
    client = ORUSAPIClient()
    command = sys.argv[1]
    
    if command == "health":
        response = client.health_check()
        print_response(response, "Health Check de ORUS")
    
    elif command == "time":
        response = client.get_time()
        print_response(response, "Hora del Servidor ORUS")
    
    elif command == "logs":
        response = client.get_logs_analysis()
        print_response(response, "Análisis de Logs ORUS")
    
    elif command == "query":
        if len(sys.argv) < 3:
            print("❌ Error: Debes proporcionar un texto para la consulta")
            print("Uso: python3 orus-api-client-extended.py query '<texto>'")
            sys.exit(1)
        
        query_text = " ".join(sys.argv[2:])
        response = client.query(query_text, "TECCIA-Z-Extended-Test")
        print_response(response, "Consulta: '" + query_text + "'")
    
    else:
        print("❌ Comando desconocido: " + command)
        sys.exit(1)

if __name__ == "__main__":
    main()