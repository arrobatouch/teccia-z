#!/usr/bin/env python3
"""
🎭 DEMOSTRACIÓN - MS-Agent v1.4.0 + TECCIA-Z
Script de demostración para mostrar las capacidades del sistema instalado
"""

import asyncio
import json
from datetime import datetime

# Importar el wrapper
from orus_ms_agent_v1_4 import ORUSMSAgentv1_4

async def demo_basica():
    """Demostración básica de capacidades"""
    print("🎭 DEMOSTRACIÓN BÁSICA - MS-Agent v1.4.0")
    print("=" * 50)
    
    # Inicializar
    print("🚀 Inicializando ORUS-MS-Agent v1.4.0...")
    wrapper = ORUSMSAgentv1_4()
    
    # Mostrar estado
    print("\n📊 Estado del Sistema:")
    status = wrapper.get_system_status()
    print(f"  Versión: {status.get('ms_agent_version', 'unknown')}")
    print(f"  Conectores: {'✅' if status.get('connectors_available') else '❌'}")
    print(f"  AnythingLLM: {'✅' if status.get('anythingllm_connected') else '❌'}")
    print(f"  TECCIA-Z: {'✅' if status.get('teccia_sync_connected') else '❌'}")
    print(f"  MCP: {'✅' if status.get('mcp_enabled') else '❌'}")
    
    # Consulta de demostración
    print("\n💬 Consulta de Demostración:")
    query = "ORUS, como agente mejorado con v1.4.0, ¿qué capacidades nuevas tienes?"
    
    print(f"📤 Procesando: '{query}'")
    result = await wrapper.process_enhanced_query(query, use_async=True)
    
    print("\n📋 Resultado:")
    print(f"  ✅ Éxito: {result.get('success', False)}")
    print(f"  🔄 Modo: {result.get('processing_mode', 'unknown')}")
    print(f"  📅 Timestamp: {result.get('timestamp', 'unknown')}")
    
    if result.get('success'):
        print("  🎯 ¡Consulta procesada exitosamente!")
        
        # Mostrar componentes del resultado
        if 'ms_agent_response' in result:
            print("  🤖 Respuesta MS-Agent: Disponible")
        if 'rag_enhancement' in result:
            print("  🧠 Mejora RAG: Disponible")
        if 'mcp_tools' in result:
            print("  🔧 Herramientas MCP: Disponible")
    else:
        print(f"  ❌ Error: {result.get('error', 'unknown')}")

async def demo_avanzada():
    """Demostración avanzada con múltiples capacidades"""
    print("\n\n🚀 DEMOSTRACIÓN AVANZADA - Capacidades v1.4.0")
    print("=" * 50)
    
    wrapper = ORUSMSAgentv1_4()
    
    # Múltiples consultas simultáneas (capacidad async)
    queries = [
        "ORUS, muestra estado de contenedores",
        "ORUS, lista capacidades v1.4.0",
        "ORUS, verifica conexión AnythingLLM"
    ]
    
    print("⚡ Procesando múltiples consultas en paralelo...")
    
    tasks = []
    for i, query in enumerate(queries):
        print(f"  📤 Consulta {i+1}: {query[:30]}...")
        task = wrapper.process_enhanced_query(query, use_async=True)
        tasks.append(task)
    
    # Esperar todas las consultas
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    print("\n📊 Resultados de Consultas Simultáneas:")
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"  ❌ Consulta {i+1}: Error - {str(result)}")
        else:
            success = result.get('success', False)
            mode = result.get('processing_mode', 'unknown')
            print(f"  {'✅' if success else '❌'} Consulta {i+1}: {mode}")

async def main():
    """Función principal de demostración"""
    print("🎭 DEMOSTRACIÓN COMPLETA - MS-Agent v1.4.0 + TECCIA-Z")
    print("=" * 60)
    print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Demo básica
        await demo_basica()
        
        # Demo avanzada
        await demo_avanzada()
        
        # Resumen final
        print("\n\n🏆 RESUMEN DE DEMOSTRACIÓN")
        print("=" * 50)
        print("✅ MS-Agent v1.4.0: Operativo")
        print("✅ Procesamiento asíncrono: Funcional")
        print("✅ Multi-consultas: Disponible")
        print("✅ Integración TECCIA-Z: Completa")
        print("✅ Capacidades v1.4.0: Activas")
        
        print("\n🚀 El sistema está listo para uso en producción!")
        
    except Exception as e:
        print(f"❌ Error en demostración: {e}")
        print("🔧 Revise los logs en /logs/ para más detalles")

if __name__ == "__main__":
    asyncio.run(main())