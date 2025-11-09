#!/usr/bin/env python3
"""
TECCIA-Z ORUS API Client
Cliente para comunicarse con ORUS Production a través de su API REST
"""

import requests
import json
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional

class ORUSAPIClient:
    def __init__(self, base_url: str = "http://188.245.56.151:8085"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'TECCIA-Z-API-Client/1.0'
        })
    
    def query(self, text: str, source: str = "TECCIA-Z-Client") -> Dict[str, Any]:
        """Enviar consulta a ORUS"""
        try:
            response = self.session.post(
                f"{self.base_url}/query",
                json={"text": text, "source": source},
                timeout=10
            )
            
            return {
                "success": response.status_code == 200,
                "status_code": response.status_code,
                "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text,
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
    
    def get_system_status(self) -> Dict[str, Any]:
        """Obtener estado completo del sistema"""
        return self.query("ORUS, estado del sistema completo", "TECCIA-Z-System-Status")
    
    def get_containers_status(self) -> Dict[str, Any]:
        """Obtener estado de contenedores"""
        return self.query("ORUS, qué contenedores están activos", "TECCIA-Z-Container-Status")
    
    def get_agents_info(self) -> Dict[str, Any]:
        """Obtener información de agentes"""
        return self.query("ORUS, dame información de los agentes del sistema", "TECCIA-Z-Agent-Info")
    
    def get_workspaces(self) -> Dict[str, Any]:
        """Obtener workspaces de AnythingLLM a través de ORUS"""
        return self.query("ORUS, lista todos los workspaces de AnythingLLM", "TECCIA-Z-Workspaces")
    
    def health_check(self) -> Dict[str, Any]:
        """Verificar salud del sistema ORUS"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=5)
            return {
                "success": response.status_code == 200,
                "status_code": response.status_code,
                "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text,
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

def print_response(response: Dict[str, Any], title: str = "Response"):
    """Formatear respuesta para mostrar"""
    print(f"\n🔍 {title}")
    print("=" * 50)
    
    if response["success"]:
        print(f"✅ Éxito: {response['status_code']}")
        if "data" in response and isinstance(response["data"], dict):
            if "message" in response["data"]:
                print(f"📄 Mensaje: {response['data']['message']}")
            else:
                print(f"📄 Datos: {json.dumps(response['data'], indent=2, ensure_ascii=False)}")
    else:
        print(f"❌ Error: {response.get('error', 'Unknown error')}")
        if "status_code" in response:
            print(f"📊 Status Code: {response['status_code']}")
    
    print(f"🕐 Timestamp: {response['timestamp']}")
    print(f"🌐 Endpoint: {response['endpoint']}")
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
        print("  query <texto>  - Enviar consulta personalizada")
        print("")
        print("Ejemplos:")
        print("  python3 orus-api-client.py health")
        print("  python3 orus-api-client.py status")
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
    
    elif command == "query":
        if len(sys.argv) < 3:
            print("❌ Error: Debes proporcionar un texto para la consulta")
            print("Uso: python3 orus-api-client.py query '<texto>'")
            sys.exit(1)
        
        query_text = " ".join(sys.argv[2:])
        response = client.query(query_text, "TECCIA-Z-Manual-Query")
        print_response(response, f"Consulta: '{query_text}'")
    
    else:
        print(f"❌ Comando desconocido: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()