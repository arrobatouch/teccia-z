#!/usr/bin/env python3
"""
TECCIA-Z ORUS API Client
Cliente para comunicarse con ORUS Production a través de su API REST
"""

import urllib.request
import json
import sys
import time
from datetime import datetime

class ORUSAPIClient:
    def __init__(self, base_url: str = "http://188.245.56.151:8085"):
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
    
    def get_system_status(self) -> dict:
        """Obtener estado completo del sistema"""
        return self.query("ORUS, estado del sistema completo", "TECCIA-Z-System-Status")
    
    def get_containers_status(self) -> dict:
        """Obtener estado de contenedores"""
        return self.query("ORUS, qué contenedores están activos", "TECCIA-Z-Container-Status")
    
    def get_agents_info(self) -> dict:
        """Obtener información de agentes"""
        return self.query("ORUS, dame información de los agentes del sistema", "TECCIA-Z-Agent-Info")
    
    def get_workspaces(self) -> dict:
        """Obtener workspaces de AnythingLLM a través de ORUS"""
        return self.query("ORUS, lista todos los workspaces de AnythingLLM", "TECCIA-Z-Workspaces")
    
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

def print_response(response: dict, title: str = "Response"):
    """Formatear respuesta para mostrar"""
    print("\n" + "=" * 50)
    print("🔍 " + title)
    print("=" * 50)
    
    if response["success"]:
        print("✅ Éxito: " + str(response['status_code']))
        if "data" in response and isinstance(response["data"], dict):
            if "message" in response["data"]:
                print("📄 Mensaje: " + response['data']['message'])
            else:
                print("📄 Datos: " + json.dumps(response['data'], indent=2, ensure_ascii=False))
    else:
        print("❌ Error: " + response.get('error', 'Unknown error'))
        if "status_code" in response:
            print("📊 Status Code: " + str(response['status_code']))
    
    print("🕐 Timestamp: " + response['timestamp'])
    print("🌐 Endpoint: " + response['endpoint'])
    print("=" * 50)

def main():
    if len(sys.argv) < 2:
        print("🔍 TECCIA-Z ORUS API Client")
        print("=" * 50)
        print("Uso:")
        print("  python3 orus-api-client.py <comando>")
        print("")
        print("Comandos disponibles:")
        print("  health          - Verificar salud de ORUS")
        print("  status          - Estado completo del sistema")
        print("  containers      - Estado de contenedores")
        print("  agents          - Información de agentes")
        print("  workspaces      - Workspaces de AnythingLLM")
        print("  time            - Hora actual del servidor")
        print("  query <texto> - Enviar consulta personalizada")
        print("")
        print("Ejemplos:")
        print("  python3 orus-api-client.py health")
        print("  python3 orus-api-client.py status")
        print("  python3 orus-api-client.py time")
        print("  python3 orus-api-client.py query 'ORUS, muestra el estado'")
        print("=" * 50)
        sys.exit(1)
    
    client = ORUSAPIClient()
    command = sys.argv[1]
    
    if command == "health":
        response = client.health_check()
        print_response(response, "Health Check de ORUS")
    
    elif command == "status":
        response = client.get_system_status()
        print_response(response, "Estado Completo del Sistema")
    
    elif command == "containers":
        response = client.get_containers_status()
        print_response(response, "Estado de Contenedores")
    
    elif command == "agents":
        response = client.get_agents_info()
        print_response(response, "Información de Agentes")
    
    elif command == "workspaces":
        response = client.get_workspaces()
        print_response(response, "Workspaces de AnythingLLM")
    
    elif command == "time":
        response = client.get_time()
        print_response(response, "Hora del Servidor ORUS")
    
    elif command == "query":
        if len(sys.argv) < 3:
            print("❌ Error: Debes proporcionar un texto para la consulta")
            print("Uso: python3 orus-api-client.py query '<texto>'")
            sys.exit(1)
        
        query_text = " ".join(sys.argv[2:])
        response = client.query(query_text, "TECCIA-Z-Manual-Query")
        print_response(response, "Consulta: '" + query_text + "'")
    
    else:
        print("❌ Comando desconocido: " + command)
        sys.exit(1)

if __name__ == "__main__":
    main()