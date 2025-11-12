#!/usr/bin/env python3
"""
🗂️ Sincronización con TECCIA-Z
Carga automáticamente nuevos "trabajos leídos" en el panel de Trabajos Realizados del sistema TECCIA-Z
"""

import os
import json
import urllib.request
import urllib.parse
import urllib.error
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

# Configuración de logging
log_dir = '/home/z/my-project/opt/modelscope-agent/logs'
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'{log_dir}/teccia_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TECCIAZSync:
    """Sincronizador para enviar trabajos al panel TECCIA-Z"""
    
    def __init__(self):
        """Inicializar el sincronizador con configuración desde variables de entorno"""
        self._load_env()
        
        self.teccia_panel_url = os.getenv('TECCIA_PANEL_URL', 'https://panel.teccia.com.ar')
        self.teccia_api_token = os.getenv('TECCIA_API_TOKEN', 'teccia-z-api-key-2025')
        
        # API endpoints
        self.api_endpoint = f"{self.teccia_panel_url}/api/trabajos/import"
        
        # Headers para la API
        self.headers = {
            'Authorization': f'Bearer {self.teccia_api_token}',
            'Content-Type': 'application/json',
            'User-Agent': 'ORUS-ModelScope-Agent/1.0'
        }
        
        # Directorio de datos
        self.data_dir = '/home/z/my-project/opt/modelscope-agent/data'
        
        logger.info(f"Sincronizador TECCIA-Z inicializado - URL: {self.teccia_panel_url}")
    
    def _load_env(self):
        """Cargar variables de entorno desde archivo .env"""
        env_file = '/home/z/my-project/opt/modelscope-agent/config/.env'
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key] = value.strip()
    
    def _make_api_request(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Realizar petición a la API de TECCIA-Z
        
        Args:
            endpoint: Endpoint de la API
            payload: Datos a enviar
            
        Returns:
            Dict con la respuesta de la API
        """
        url = f"{self.teccia_panel_url}{endpoint}"
        
        try:
            logger.info(f"Enviando a TECCIA-Z API: {url}")
            
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers=self.headers
            )
            
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    logger.info(f"✅ Petición exitosa a TECCIA-Z API")
                    return {
                        "success": True,
                        "data": data,
                        "status_code": response.status
                    }
                else:
                    error_msg = f"Error HTTP {response.status}: {response.read().decode()}"
                    logger.error(f"❌ Error en petición TECCIA-Z: {error_msg}")
                    return {
                        "success": False,
                        "error": error_msg,
                        "status_code": response.status
                    }
                    
        except urllib.error.HTTPError as e:
            error_msg = f"Error HTTP {e.code}: {e.reason}"
            logger.error(f"❌ Error HTTP con TECCIA-Z: {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "status_code": e.code
            }
        except urllib.error.URLError as e:
            error_msg = f"Error de conexión: {str(e.reason)}"
            logger.error(f"❌ Error de conexión con TECCIA-Z: {error_msg}")
            return {
                "success": False,
                "error": error_msg
            }
        except Exception as e:
            error_msg = f"Error inesperado: {str(e)}"
            logger.error(f"❌ Error inesperado: {error_msg}")
            return {
                "success": False,
                "error": error_msg
            }
    
    def load_github_sync_data(self) -> List[Dict[str, Any]]:
        """
        Cargar datos de sincronización de GitHub
        
        Returns:
            Lista de datos sincronizados
        """
        sync_file = f"{self.data_dir}/github_sync.json"
        
        try:
            if os.path.exists(sync_file):
                with open(sync_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                logger.info(f"✅ Cargados {len(data)} registros desde GitHub sync")
                return data if isinstance(data, list) else []
            else:
                logger.warning("⚠️ No se encontró archivo github_sync.json")
                return []
        except Exception as e:
            error_msg = f"Error cargando datos GitHub: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return []
    
    def create_trabajo_payload(self, github_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crear payload para enviar a TECCIA-Z desde datos de GitHub
        
        Args:
            github_data: Datos procesados de GitHub
            
        Returns:
            Payload formateado para TECCIA-Z API
        """
        file_name = github_data.get("file", "unknown")
        summary = github_data.get("summary", "")
        
        # Determinar título y descripción según el tipo de archivo
        if file_name.upper() == "README.MD":
            titulo = "Análisis automático de README"
            descripcion = f"Procesamiento del README.md del repositorio {github_data.get('repo', 'unknown')}. {summary[:200]}..."
        elif file_name.upper() == "CHANGELOG.MD":
            titulo = "Análisis automático de CHANGELOG"
            descripcion = f"Procesamiento del CHANGELOG.md del repositorio {github_data.get('repo', 'unknown')}. {summary[:200]}..."
        else:
            titulo = f"Análisis de {file_name}"
            descripcion = f"Procesamiento automático del archivo {file_name}. {summary[:200]}..."
        
        return {
            "titulo": titulo,
            "descripcion": descripcion,
            "origen": "ORUS",
            "categoria": "Integración Cognitiva",
            "estado": "Completado",
            "metadatos": {
                "file": file_name,
                "repo": github_data.get("repo"),
                "word_count": github_data.get("word_count", 0),
                "line_count": github_data.get("line_count", 0),
                "file_size": github_data.get("file_size", 0),
                "processed_at": github_data.get("processed_at"),
                "source": github_data.get("source"),
                "sha": github_data.get("sha")
            }
        }
    
    def sync_github_data_to_teccia(self) -> Dict[str, Any]:
        """
        Sincronizar datos de GitHub con TECCIA-Z
        
        Returns:
            Dict con resultado de la sincronización
        """
        logger.info("Iniciando sincronización de datos GitHub con TECCIA-Z")
        
        # Cargar datos de GitHub
        github_data = self.load_github_sync_data()
        
        if not github_data:
            return {
                "success": False,
                "error": "No hay datos de GitHub para sincronizar"
            }
        
        results = []
        successful_syncs = 0
        
        for data in github_data:
            logger.info(f"Procesando sincronización para: {data.get('file')}")
            
            # Crear payload
            payload = self.create_trabajo_payload(data)
            
            # Enviar a TECCIA-Z
            sync_result = self._make_api_request("/api/trabajos/import", payload)
            
            if sync_result["success"]:
                results.append({
                    "file": data.get("file"),
                    "success": True,
                    "titulo": payload["titulo"],
                    "response": sync_result["data"]
                })
                successful_syncs += 1
                logger.info(f"✅ Sincronizado exitosamente: {data.get('file')}")
            else:
                results.append({
                    "file": data.get("file"),
                    "success": False,
                    "error": sync_result.get("error"),
                    "titulo": payload["titulo"]
                })
                logger.error(f"❌ Error sincronizando {data.get('file')}: {sync_result.get('error')}")
        
        return {
            "success": True,
            "total_processed": len(github_data),
            "successful_syncs": successful_syncs,
            "failed_syncs": len(github_data) - successful_syncs,
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
    
    def send_custom_trabajo(self, titulo: str, descripcion: str, 
                          categoria: str = "Integración Cognitiva") -> Dict[str, Any]:
        """
        Enviar un trabajo personalizado a TECCIA-Z
        
        Args:
            titulo: Título del trabajo
            descripcion: Descripción del trabajo
            categoria: Categoría del trabajo
            
        Returns:
            Dict con resultado del envío
        """
        payload = {
            "titulo": titulo,
            "descripcion": descripcion,
            "origen": "ORUS",
            "categoria": categoria,
            "estado": "Completado",
            "metadatos": {
                "created_at": datetime.now().isoformat(),
                "source": "ORUS ModelScope Agent",
                "type": "custom_sync"
            }
        }
        
        logger.info(f"Enviando trabajo personalizado: {titulo}")
        
        result = self._make_api_request("/api/trabajos/import", payload)
        
        if result["success"]:
            logger.info(f"✅ Trabajo personalizado enviado exitosamente: {titulo}")
        else:
            logger.error(f"❌ Error enviando trabajo personalizado: {result.get('error')}")
        
        return result
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Probar conexión con TECCIA-Z API
        
        Returns:
            Dict con resultado del test
        """
        logger.info("Probando conexión con TECCIA-Z API...")
        
        # Enviar un trabajo de prueba
        test_payload = {
            "titulo": "Test de Conexión ORUS",
            "descripcion": "Prueba de conexión desde ORUS ModelScope Agent",
            "origen": "ORUS",
            "categoria": "Test",
            "estado": "Completado",
            "metadatos": {
                "test": True,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        result = self._make_api_request("/api/trabajos/import", test_payload)
        
        if result["success"]:
            logger.info("✅ Test de conexión con TECCIA-Z exitoso")
        else:
            logger.error(f"❌ Test de conexión con TECCIA-Z fallido: {result.get('error')}")
        
        return result
    
    def get_sync_status(self) -> Dict[str, Any]:
        """
        Obtener estado actual de sincronización
        
        Returns:
            Dict con estado de sincronización
        """
        github_data = self.load_github_sync_data()
        
        return {
            "github_data_available": len(github_data),
            "last_sync": datetime.now().isoformat(),
            "teccia_api_endpoint": self.api_endpoint,
            "data_directory": self.data_dir,
            "log_file": f"{log_dir}/teccia_sync.log"
        }

def main():
    """Función principal para pruebas del sincronizador"""
    sync = TECCIAZSync()
    
    # Test de conexión
    print("🔍 Probando conexión con TECCIA-Z API...")
    test_result = sync.test_connection()
    print(f"Resultado: {json.dumps(test_result, indent=2)}")
    
    # Estado de sincronización
    print("\n📊 Estado de sincronización...")
    status_result = sync.get_sync_status()
    print(f"Estado: {json.dumps(status_result, indent=2)}")
    
    # Sincronizar datos de GitHub
    print("\n🔄 Sincronizando datos de GitHub con TECCIA-Z...")
    sync_result = sync.sync_github_data_to_teccia()
    print(f"Resultado: {json.dumps(sync_result, indent=2)}")

if __name__ == "__main__":
    main()