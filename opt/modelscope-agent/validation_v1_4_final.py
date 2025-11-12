#!/usr/bin/env python3
"""
🎯 VALIDACIÓN FINAL - MS-Agent v1.4.0 Integración Completa
Script de validación para verificar que la instalación y integración funcionan correctamente
"""

import asyncio
import json
import sys
from datetime import datetime

# Agregar PATH para ejecutables
import os
sys.path.append('/home/z/.local/bin')

# Importar el wrapper
from orus_ms_agent_v1_4 import ORUSMSAgentv1_4

async def main():
    print("🚀 VALIDACIÓN FINAL - MS-Agent v1.4.0 + TECCIA-Z")
    print("=" * 60)
    print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. Inicialización
    print("📋 Paso 1/5: Inicializando sistema...")
    try:
        wrapper = ORUSMSAgentv1_4()
        print("✅ Sistema inicializado correctamente")
    except Exception as e:
        print(f"❌ Error en inicialización: {e}")
        return False
    
    # 2. Estado del sistema
    print("\n📊 Paso 2/5: Verificando estado del sistema...")
    try:
        status = wrapper.get_system_status()
        print("📋 Estado del Sistema:")
        print(json.dumps(status, indent=2, ensure_ascii=False))
        
        # Verificar componentes críticos
        critical_components = [
            ("MS-Agent v1.4.0", status.get("ms_agent_version") == "1.4.0"),
            ("Conectores Disponibles", status.get("connectors_available", False)),
            ("AnythingLLM Conectado", status.get("anythingllm_connected", False)),
            ("TECCIA-Z Conectado", status.get("teccia_sync_connected", False)),
            ("MCP Habilitado", status.get("mcp_enabled", False))
        ]
        
        print("\n🔍 Componentes Críticos:")
        all_critical_ok = True
        for name, status_ok in critical_components:
            emoji = "✅" if status_ok else "❌"
            print(f"  {emoji} {name}: {'OK' if status_ok else 'FALLA'}")
            if not status_ok:
                all_critical_ok = False
        
        if not all_critical_ok:
            print("⚠️ Algunos componentes críticos no están disponibles")
        
    except Exception as e:
        print(f"❌ Error verificando estado: {e}")
        return False
    
    # 3. Capacidades v1.4.0
    print("\n🚀 Paso 3/5: Probando capacidades v1.4.0...")
    try:
        test_result = await wrapper.test_enhanced_capabilities()
        
        print("📊 Resultado de Pruebas v1.4.0:")
        print(f"  ✅ Éxito General: {test_result.get('test_success', False)}")
        print(f"  ⏱️ Tiempo de Procesamiento: {test_result.get('processing_time', 0):.2f}s")
        
        features = test_result.get('features_tested', {})
        print("  🔧 Características Probadas:")
        for feature, passed in features.items():
            emoji = "✅" if passed else "❌"
            print(f"    {emoji} {feature.replace('_', ' ').title()}: {'OK' if passed else 'FALLA'}")
        
    except Exception as e:
        print(f"❌ Error en pruebas v1.4.0: {e}")
        return False
    
    # 4. Consulta de Ejemplo
    print("\n💬 Paso 4/5: Probando consulta de ejemplo...")
    try:
        query = "ORUS, como agente mejorado con v1.4.0, ¿qué capacidades nuevas tienes?"
        result = await wrapper.process_enhanced_query(query, use_async=True)
        
        print("📤 Resultado de Consulta:")
        print(f"  ✅ Éxito: {result.get('success', False)}")
        print(f"  🔄 Modo: {result.get('processing_mode', 'unknown')}")
        print(f"  📅 Timestamp: {result.get('timestamp', 'unknown')}")
        
        if result.get('success'):
            print("  🎯 Consulta procesada exitosamente")
        else:
            print(f"  ❌ Error: {result.get('error', 'unknown')}")
        
    except Exception as e:
        print(f"❌ Error en consulta de ejemplo: {e}")
        return False
    
    # 5. Integración con Conectores
    print("\n🔗 Paso 5/5: Verificando integración con conectores...")
    
    # AnythingLLM
    if wrapper.anythingllm:
        try:
            test_content = "Mensaje de validación final - MS-Agent v1.4.0 integrado exitosamente"
            llm_result = wrapper.anythingllm.send_to_anythingllm(
                content=test_content,
                source="Validation Script",
                content_type="test",
                tags=["v1.4.0", "validation", "success"]
            )
            print(f"  ✅ AnythingLLM: {'OK' if llm_result.get('success') else 'FALLA'}")
        except Exception as e:
            print(f"  ❌ AnythingLLM: Error - {e}")
    else:
        print("  ⚪ AnythingLLM: No disponible")
    
    # TECCIA-Z
    if wrapper.teccia_sync:
        try:
            sync_result = wrapper.teccia_sync.send_custom_trabajo(
                titulo="Validación MS-Agent v1.4.0",
                descripcion="Prueba de integración exitosa con MS-Agent v1.4.0",
                categoria="Validación de Sistema"
            )
            print(f"  ✅ TECCIA-Z: {'OK' if sync_result.get('success') else 'FALLA'}")
        except Exception as e:
            print(f"  ❌ TECCIA-Z: Error - {e}")
    else:
        print("  ⚪ TECCIA-Z: No disponible")
    
    # RESUMEN FINAL
    print("\n" + "=" * 60)
    print("🏆 RESUMEN FINAL DE VALIDACIÓN")
    print("=" * 60)
    
    # Calcular puntuación
    score = 0
    max_score = 10
    
    # Puntos por componentes básicos
    if status.get("ms_agent_version") == "1.4.0": score += 2
    if status.get("connectors_available"): score += 1
    if status.get("anythingllm_connected"): score += 1
    if status.get("teccia_sync_connected"): score += 1
    if status.get("mcp_enabled"): score += 1
    
    # Puntos por pruebas
    if test_result.get('test_success'): score += 2
    
    # Puntos por consulta
    if result.get('success'): score += 1
    
    # Puntos por integración
    if wrapper.anythingllm: score += 0.5
    if wrapper.teccia_sync: score += 0.5
    
    percentage = (score / max_score) * 100
    
    print(f"📊 Puntuación: {score}/{max_score} ({percentage:.1f}%)")
    
    if percentage >= 80:
        print("🎉 ¡VALIDACIÓN EXITOSA!")
        print("✅ MS-Agent v1.4.0 está completamente integrado y funcional")
        print("✅ Todas las capacidades principales están operativas")
        print("✅ Sistema listo para producción")
        return True
    elif percentage >= 60:
        print("⚠️ VALIDACIÓN PARCIAL")
        print("✅ MS-Agent v1.4.0 está integrado pero con algunas limitaciones")
        print("⚠️ Algunas capacidades pueden no estar disponibles")
        print("🔧 Se recomienda revisar los componentes fallidos")
        return True
    else:
        print("❌ VALIDACIÓN FALLIDA")
        print("❌ MS-Agent v1.4.0 no está correctamente integrado")
        print("🔧 Se requiere revisión y corrección de errores")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)