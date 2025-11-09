#!/usr/bin/env python3
"""
🔗 Conector a AnythingLLM (Actualizado)
Permite que ORUS envíe fragmentos de texto relevantes a AnythingLLM para almacenamiento semántico
"""

import os
import json
import urllib.request
import urllib.parse
import urllib.error
import logging
from datetime import datetime
from typing import Dict, Any, Optional

# Configuración de logging
log_dir = '/home/z/my-project/opt/modelscope-agent/logs'
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'{log_dir}/anythingllm_ingest.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AnythingLLMConnector:
    """Conector para enviar texto a AnythingLLM para ingestión semántica"""
    
    def __init__(self):
        """Inicializar el conector con configuración desde variables de entorno"""
        # Cargar variables de entorno manualmente
        self._load_env()
        
        self.anythingllm_url = os.getenv('ANYTHINGLLM_URL', 'https://orus.teccia.com.ar')
        self.anythingllm_token = os.getenv('ANYTHINGLLM_TOKEN', 'HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N')
        self.workspace = os.getenv('ANYTHINGLLM_WORKSPACE', 'default')
        
        # Construir URL del endpoint
        self.ingest_url = f"{self.anythingllm_url}/api/v1/workspace/{self.workspace}/ingest"
        
        logger.info(f"Conector AnythingLLM inicializado - URL: {self.anythingllm_url}")
    
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
    
    def send_to_anythingllm(self, content: str, source: str = "ORUS", 
                          content_type: str = "text", tags: list = None) -> Dict[str, Any]:
        """
        Enviar contenido a AnythingLLM para ingestión semántica
        
        Args:
            content: Texto a enviar
            source: Fuente del contenido (default: "ORUS")
            content_type: Tipo de contenido (default: "text")
            tags: Lista de etiquetas para el contenido
            
        Returns:
            Dict con resultado de la operación
        """
        if tags is None:
            tags = ["analyzed", "auto-ingest"]
        
        # Preparar payload
        payload = {
            "source": source,
            "type": content_type,
            "content": content,
            "tags": tags
        }
        
        try:
            logger.info(f"Enviando contenido a AnythingLLM - Source: {source}, Length: {len(content)} chars")
            
            # Preparar headers
            headers = {
                'Authorization': f'Bearer {self.anythingllm_token}',
                'Content-Type': 'application/json'
            }
            
            # Crear petición
            req = urllib.request.Request(
                self.ingest_url,
                data=json.dumps(payload).encode('utf-8'),
                headers=headers
            )
            
            # Realizar petición
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status == 200:
                    result = {
                        "success": True,
                        "status_code": response.status,
                        "message": "Contenido enviado exitosamente a AnythingLLM",
                        "timestamp": datetime.now().isoformat(),
                        "content_length": len(content),
                        "source": source
                    }
                    logger.info(f"✅ Éxito: Contenido enviado a AnythingLLM - {len(content)} caracteres")
                    return result
                else:
                    error_msg = f"Error HTTP {response.status}: {response.read().decode()}"
                    logger.error(f"❌ Error enviando a AnythingLLM: {error_msg}")
                    return {
                        "success": False,
                        "status_code": response.status,
                        "error": error_msg,
                        "timestamp": datetime.now().isoformat(),
                        "source": source
                    }
                
        except urllib.error.HTTPError as e:
            error_msg = f"Error HTTP {e.code}: {e.reason}"
            logger.error(f"❌ Error HTTP con AnythingLLM: {error_msg}")
            return {
                "success": False,
                "status_code": e.code,
                "error": error_msg,
                "timestamp": datetime.now().isoformat(),
                "source": source
            }
        except urllib.error.URLError as e:
            error_msg = f"Error de conexión: {str(e.reason)}"
            logger.error(f"❌ Error de conexión con AnythingLLM: {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "timestamp": datetime.now().isoformat(),
                "source": source
            }
        except Exception as e:
            error_msg = f"Error inesperado: {str(e)}"
            logger.error(f"❌ Error inesperado: {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "timestamp": datetime.now().isoformat(),
                "source": source
            }
    
    def send_log_analysis(self, log_content: str, analysis_summary: str) -> Dict[str, Any]:
        """
        Enviar análisis de logs a AnythingLLM
        
        Args:
            log_content: Contenido del log analizado
            analysis_summary: Resumen del análisis
            
        Returns:
            Dict con resultado de la operación
        """
        content = f"""
ANÁLISIS DE LOGS - ORUS
========================

Resumen del Análisis:
{analysis_summary}

Contenido del Log:
{log_content[:2000]}  # Limitar a 2000 caracteres para evitar sobrecarga

---
Generado por: ORUS ModelScope Agent
Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """.strip()
        
        return self.send_to_anythingllm(
            content=content,
            source="ORUS Log Analyzer",
            content_type="log_analysis",
            tags=["logs", "analyzed", "auto-ingest", "error_detection"]
        )
    
    def send_document_summary(self, document_path: str, summary: str, 
                            original_content: str = None) -> Dict[str, Any]:
        """
        Enviar resumen de documento a AnythingLLM
        
        Args:
            document_path: Ruta del documento original
            summary: Resumen generado por ORUS
            original_content: Contenido original (opcional)
            
        Returns:
            Dict con resultado de la operación
        """
        content = f"""
RESUMEN DE DOCUMENTO - ORUS
==========================

Documento: {document_path}
Fecha de análisis: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Resumen Generado:
{summary}

{"Contenido Original (primeros 1000 caracteres):" + original_content[:1000] if original_content else ""}

---
Analizado por: ORUS ModelScope Agent
        """.strip()
        
        return self.send_to_anythingllm(
            content=content,
            source=f"ORUS Document Analyzer - {os.path.basename(document_path)}",
            content_type="document_summary",
            tags=["document", "analyzed", "auto-ingest", "summary"]
        )
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Probar conexión con AnythingLLM
        
        Returns:
            Dict con resultado del test de conexión
        """
        test_content = "Mensaje de prueba desde ORUS ModelScope Agent - Conexión verificada"
        
        result = self.send_to_anythingllm(
            content=test_content,
            source="ORUS Connection Test",
            content_type="test",
            tags=["test", "connection"]
        )
        
        if result["success"]:
            logger.info("✅ Test de conexión con AnythingLLM exitoso")
        else:
            logger.error(f"❌ Test de conexión con AnythingLLM fallido: {result.get('error', 'Unknown error')}")
        
        return result

def main():
    """Función principal para pruebas del conector"""
    connector = AnythingLLMConnector()
    
    # Test de conexión
    print("🔍 Probando conexión con AnythingLLM...")
    test_result = connector.test_connection()
    print(f"Resultado: {json.dumps(test_result, indent=2)}")
    
    # Ejemplo de envío de análisis
    print("\n📤 Enviando análisis de ejemplo...")
    analysis_result = connector.send_log_analysis(
        log_content="ERROR: Connection timeout to database\nWARNING: Memory usage at 85%",
        analysis_summary="Se detectaron 2 problemas: timeout de conexión y alto uso de memoria"
    )
    print(f"Resultado: {json.dumps(analysis_result, indent=2)}")

if __name__ == "__main__":
    main()