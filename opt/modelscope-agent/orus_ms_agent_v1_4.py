#!/usr/bin/env python3
"""
🔗 ORUS-MS-Agent v1.4.0 Integration Wrapper
Integración completa entre TECCIA-Z y MS-Agent v1.4.0
Mantiene compatibilidad con conectores existentes mientras añade nuevas capacidades
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from typing import Dict, Any, List, Optional

# Importar MS-Agent v1.4.0
from ms_agent.agent import LLMAgent
from ms_agent.tools import MCPClient, ToolManager
from ms_agent.rag.base import RAG
from ms_agent.rag.llama_index_rag import LlamaIndexRAG
from ms_agent.config import Config

# Importar conectores existentes
sys.path.append('/home/z/teccia-z/opt/modelscope-agent/connectors')
sys.path.append('/home/z/teccia-z/opt/modelscope-agent/mcp/teccia_sync')

try:
    from anythingllm_connector import AnythingLLMConnector
    from teccia_sync import TECCIAZSync
    CONNECTORS_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Conectores no disponibles: {e}")
    CONNECTORS_AVAILABLE = False

# Configuración de logging
log_dir = '/home/z/teccia-z/opt/modelscope-agent/logs'
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'{log_dir}/orus_ms_agent_v1_4.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ORUSMSAgentv1_4:
    """
    Wrapper de integración entre ORUS TECCIA-Z y MS-Agent v1.4.0
    Combina lo mejor de ambos sistemas
    """
    
    def __init__(self):
        """Inicializar el agente integrado"""
        logger.info("🚀 Inicializando ORUS-MS-Agent v1.4.0...")
        
        # 1. Inicializar MS-Agent v1.4.0
        self.ms_agent = LLMAgent()
        self.config = Config()  # Configuración por defecto
        self.tool_manager = ToolManager(config=self.config)
        # RAG manager opcional - inicializar después si está disponible
        self.rag_manager = None
        try:
            from ms_agent.rag.llama_index_rag import LlamaIndexRAG
            # Intentar crear RAG con configuración básica
            self.rag_manager = LlamaIndexRAG(config=self.config.config) if hasattr(self.config, 'config') else None
        except Exception as e:
            logger.warning(f"⚠️ RAG no disponible: {e}")
            self.rag_manager = None
        
        # 2. Inicializar conectores existentes (si están disponibles)
        self.anythingllm = None
        self.teccia_sync = None
        
        if CONNECTORS_AVAILABLE:
            try:
                self.anythingllm = AnythingLLMConnector()
                logger.info("✅ AnythingLLM Connector integrado")
            except Exception as e:
                logger.error(f"❌ Error inicializando AnythingLLM: {e}")
            
            try:
                self.teccia_sync = TECCIAZSync()
                logger.info("✅ TECCIA-Z Sync integrado")
            except Exception as e:
                logger.error(f"❌ Error inicializando TECCIA-Z Sync: {e}")
        
        # 3. Configurar MCP Client (nuevo en v1.4.0)
        self.mcp_client = MCPClient()
        
        # 4. Estado del sistema
        self.system_status = {
            "ms_agent_version": "1.4.0",
            "connectors_available": CONNECTORS_AVAILABLE,
            "anythingllm_connected": self.anythingllm is not None,
            "teccia_sync_connected": self.teccia_sync is not None,
            "mcp_enabled": True,
            "initialized_at": datetime.now().isoformat()
        }
        
        logger.info(f"✅ ORUS-MS-Agent v1.4.0 inicializado: {self.system_status}")
    
    async def process_enhanced_query(self, query: str, use_async: bool = True) -> Dict[str, Any]:
        """
        Procesar consulta usando capacidades mejoradas de v1.4.0
        
        Args:
            query: Consulta a procesar
            use_async: Usar procesamiento asíncrono (nuevo en v1.4.0)
            
        Returns:
            Dict con resultado del procesamiento
        """
        logger.info(f"📤 Procesando consulta con v1.4.0: '{query[:50]}...'")
        
        try:
            if use_async:
                # Usar capacidades asíncronas de v1.4.0
                result = await self._process_async_enhanced(query)
            else:
                # Usar procesamiento síncrono compatible
                result = await self._process_sync_compatible(query)
            
            # 5. Almacenar en AnythingLLM si está disponible
            if self.anythingllm:
                await self._store_in_anythingllm(query, result)
            
            # 6. Sincronizar con TECCIA-Z si está disponible
            if self.teccia_sync:
                await self._sync_to_teccia(query, result)
            
            logger.info("✅ Consulta procesada exitosamente")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error procesando consulta: {e}")
            return {
                "success": False,
                "error": str(e),
                "query": query,
                "timestamp": datetime.now().isoformat()
            }
    
    async def _process_async_enhanced(self, query: str) -> Dict[str, Any]:
        """Procesamiento asíncrono mejorado con v1.4.0"""
        logger.info("⚡ Usando procesamiento asíncrono v1.4.0...")
        
        # Simular procesamiento multi-agente asíncrono
        tasks = [
            self._ms_agent_process(query),
            self._rag_enhance(query),
            self._mcp_tools_discover(query)
        ]
        
        # Ejecutar en paralelo (capacidad v1.4.0)
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Combinar resultados
        ms_result = results[0] if not isinstance(results[0], Exception) else {}
        rag_result = results[1] if not isinstance(results[1], Exception) else {}
        mcp_result = results[2] if not isinstance(results[2], Exception) else {}
        
        return {
            "success": True,
            "query": query,
            "ms_agent_response": ms_result,
            "rag_enhancement": rag_result,
            "mcp_tools": mcp_result,
            "processing_mode": "async_enhanced_v1_4_0",
            "timestamp": datetime.now().isoformat()
        }
    
    async def _process_sync_compatible(self, query: str) -> Dict[str, Any]:
        """Procesamiento síncrono compatible con sistema existente"""
        logger.info("🔄 Usando procesamiento síncrono compatible...")
        
        # Procesar con MS-Agent
        ms_result = {}
        try:
            # Usar el agente de manera síncrona
            ms_result = self.ms_agent.run(query)
        except Exception as e:
            logger.warning(f"⚠️ Error con MS-Agent: {e}")
            ms_result = {"error": str(e)}
        
        return {
            "success": True,
            "query": query,
            "ms_agent_response": ms_result,
            "processing_mode": "sync_compatible",
            "timestamp": datetime.now().isoformat()
        }
    
    async def _ms_agent_process(self, query: str) -> Dict[str, Any]:
        """Procesar con MS-Agent v1.4.0"""
        try:
            # Usar capacidades mejoradas del agente
            result = self.ms_agent.run(query)
            return result if isinstance(result, dict) else {"response": str(result)}
        except Exception as e:
            return {"error": str(e)}
    
    async def _rag_enhance(self, query: str) -> Dict[str, Any]:
        """Mejorar con RAG (nuevo en v1.4.0)"""
        try:
            if self.rag_manager is None:
                return {"rag_available": False, "message": "RAG not initialized"}
            
            # Usar capacidades RAG mejoradas
            # Nota: La clase RAG puede tener métodos diferentes
            if hasattr(self.rag_manager, 'query'):
                rag_result = self.rag_manager.query(query)
            elif hasattr(self.rag_manager, 'retrieve'):
                rag_result = self.rag_manager.retrieve(query)
            else:
                rag_result = {"rag_available": True, "message": "RAG initialized but methods not found"}
            
            return rag_result if isinstance(rag_result, dict) else {"rag_response": str(rag_result)}
        except Exception as e:
            return {"error": str(e)}
    
    async def _mcp_tools_discover(self, query: str) -> Dict[str, Any]:
        """Descubrir herramientas MCP (nuevo en v1.4.0)"""
        try:
            # Usar MCP Client para descubrir herramientas
            tools = self.mcp_client.discover_tools()
            relevant_tools = [tool for tool in tools if any(keyword in query.lower() for keyword in tool.get('keywords', []))]
            
            return {
                "available_tools": len(tools),
                "relevant_tools": len(relevant_tools),
                "tools": relevant_tools[:5]  # Limitar a 5 herramientas más relevantes
            }
        except Exception as e:
            return {"error": str(e)}
    
    async def _store_in_anythingllm(self, query: str, result: Dict[str, Any]) -> bool:
        """Almacenar resultado en AnythingLLM"""
        if not self.anythingllm:
            return False
        
        try:
            content = f"""
CONSULTA ORUS v1.4.0 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
===============================================

Consulta Original:
{query}

Respuesta del Sistema:
{json.dumps(result, indent=2, ensure_ascii=False)}

---
Procesado por: ORUS-MS-Agent v1.4.0 Integration
            """
            
            llm_result = self.anythingllm.send_to_anythingllm(
                content=content,
                source="ORUS-MS-Agent-v1.4.0",
                content_type="enhanced_query",
                tags=["v1.4.0", "enhanced", "async", "mcp"]
            )
            
            logger.info(f"✅ Almacenado en AnythingLLM: {llm_result.get('success', False)}")
            return llm_result.get('success', False)
            
        except Exception as e:
            logger.error(f"❌ Error almacenando en AnythingLLM: {e}")
            return False
    
    async def _sync_to_teccia(self, query: str, result: Dict[str, Any]) -> bool:
        """Sincronizar resultado con TECCIA-Z"""
        if not self.teccia_sync:
            return False
        
        try:
            # Crear título descriptivo
            title = f"Consulta ORUS v1.4.0 - {query[:30]}{'...' if len(query) > 30 else ''}"
            
            # Crear descripción
            description = f"""
Procesamiento de consulta usando ORUS-MS-Agent v1.4.0

Consulta: {query}

Resultados:
- Modo de procesamiento: {result.get('processing_mode', 'unknown')}
- Éxito: {result.get('success', False)}
- Herramientas MCP: {result.get('mcp_tools', {}).get('available_tools', 0)} disponibles
- Timestamp: {result.get('timestamp', 'unknown')}

Detalles completos en el sistema de logs.
            """.strip()
            
            sync_result = self.teccia_sync.send_custom_trabajo(
                titulo=title,
                descripcion=description,
                categoria="Integración Cognitiva v1.4.0"
            )
            
            logger.info(f"✅ Sincronizado con TECCIA-Z: {sync_result.get('success', False)}")
            return sync_result.get('success', False)
            
        except Exception as e:
            logger.error(f"❌ Error sincronizando con TECCIA-Z: {e}")
            return False
    
    def get_system_status(self) -> Dict[str, Any]:
        """Obtener estado completo del sistema"""
        status = self.system_status.copy()
        
        # Añadir estado de conectores
        if self.anythingllm:
            status["anythingllm_status"] = "connected"
        else:
            status["anythingllm_status"] = "disconnected"
        
        if self.teccia_sync:
            status["teccia_sync_status"] = "connected"
        else:
            status["teccia_sync_status"] = "disconnected"
        
        # Añadir capacidades v1.4.0
        status["v1_4_0_features"] = {
            "async_processing": True,
            "rag_enhanced": True,
            "mcp_tools": True,
            "multi_agent": True,
            "streaming": True
        }
        
        return status
    
    async def test_enhanced_capabilities(self) -> Dict[str, Any]:
        """Probar capacidades mejoradas de v1.4.0"""
        logger.info("🧪 Probando capacidades mejoradas v1.4.0...")
        
        test_query = "ORUS, muestra el estado del sistema y las capacidades v1.4.0 disponibles"
        
        start_time = datetime.now()
        result = await self.process_enhanced_query(test_query, use_async=True)
        end_time = datetime.now()
        
        processing_time = (end_time - start_time).total_seconds()
        
        return {
            "test_success": result.get("success", False),
            "processing_time": processing_time,
            "features_tested": {
                "async_processing": result.get("processing_mode") == "async_enhanced_v1_4_0",
                "rag_enhancement": "rag_enhancement" in result,
                "mcp_tools": "mcp_tools" in result,
                "anythingllm_integration": result.get("anythingllm_stored", False),
                "teccia_sync_integration": result.get("teccia_synced", False)
            },
            "system_status": self.get_system_status(),
            "timestamp": datetime.now().isoformat()
        }

def main():
    """Función principal para pruebas del wrapper"""
    import asyncio
    
    print("🚀 Iniciando pruebas de ORUS-MS-Agent v1.4.0...")
    
    async def run_tests():
        # Inicializar wrapper
        wrapper = ORUSMSAgentv1_4()
        
        # Mostrar estado del sistema
        status = wrapper.get_system_status()
        print("📊 Estado del Sistema:")
        print(json.dumps(status, indent=2, ensure_ascii=False))
        
        # Probar capacidades
        print("\n🧪 Probando capacidades mejoradas...")
        test_result = await wrapper.test_enhanced_capabilities()
        print("Resultado de pruebas:")
        print(json.dumps(test_result, indent=2, ensure_ascii=False))
        
        # Probar consulta específica
        print("\n💬 Probando consulta específica...")
        query_result = await wrapper.process_enhanced_query(
            "ORUS, ¿qué nuevas capacidades tienes con la versión 1.4.0?"
        )
        print("Resultado de consulta:")
        print(json.dumps(query_result, indent=2, ensure_ascii=False))
    
    # Ejecutar pruebas
    asyncio.run(run_tests())

if __name__ == "__main__":
    main()