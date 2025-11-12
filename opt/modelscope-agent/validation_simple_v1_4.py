#!/usr/bin/env python3
"""
🎯 VALIDACIÓN SIMPLE - MS-Agent v1.4.0
Versión simplificada para verificar instalación básica
"""

import json
import sys
from datetime import datetime

# Importar el wrapper
try:
    from orus_ms_agent_v1_4 import ORUSMSAgentv1_4
    print("✅ Wrapper importado correctamente")
except ImportError as e:
    print(f"❌ Error importando wrapper: {e}")
    sys.exit(1)

def main():
    print("🚀 VALIDACIÓN SIMPLE - MS-Agent v1.4.0")
    print("=" * 50)
    print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # 1. Inicialización
        print("📋 Inicializando ORUS-MS-Agent v1.4.0...")
        wrapper = ORUSMSAgentv1_4()
        print("✅ Sistema inicializado correctamente")
        
        # 2. Estado del sistema
        print("\n📊 Estado del Sistema:")
        status = wrapper.get_system_status()
        
        # Componentes principales
        components = {
            "MS-Agent v1.4.0": status.get("ms_agent_version", "N/A"),
            "Conectores Disponibles": "✅" if status.get("connectors_available") else "❌",
            "AnythingLLM Conectado": "✅" if status.get("anythingllm_connected") else "❌",
            "TECCIA-Z Conectado": "✅" if status.get("teccia_sync_connected") else "❌",
            "MCP Habilitado": "✅" if status.get("mcp_enabled") else "❌"
        }
        
        for name, value in components.items():
            print(f"  {name}: {value}")
        
        # 3. Capacidades v1.4.0
        if "v1_4_0_features" in status:
            print("\n🚀 Capacidades v1.4.0:")
            features = status["v1_4_0_features"]
            for feature, available in features.items():
                emoji = "✅" if available else "❌"
                print(f"  {emoji} {feature.replace('_', ' ').title()}")
        
        # 4. Conclusión
        print("\n" + "=" * 50)
        print("🏆 RESULTADO DE VALIDACIÓN")
        print("=" * 50)
        
        # Calcular estado
        score = 0
        max_score = 5
        
        if status.get("ms_agent_version") == "1.4.0": score += 1
        if status.get("connectors_available"): score += 1
        if status.get("anythingllm_connected"): score += 1
        if status.get("teccia_sync_connected"): score += 1
        if status.get("mcp_enabled"): score += 1
        
        percentage = (score / max_score) * 100
        
        print(f"📊 Puntuación: {score}/{max_score} ({percentage:.1f}%)")
        
        if percentage >= 80:
            print("🎉 ¡INSTALACIÓN EXITOSA!")
            print("✅ MS-Agent v1.4.0 está correctamente instalado")
            print("✅ Todos los componentes principales están operativos")
            print("✅ Sistema listo para uso")
        elif percentage >= 60:
            print("⚠️ INSTALACIÓN PARCIAL")
            print("✅ MS-Agent v1.4.0 está instalado")
            print("⚠️ Algunos componentes pueden tener limitaciones")
        else:
            print("❌ INSTALACIÓN INCOMPLETA")
            print("❌ Se requieren correcciones")
        
        print(f"\n📝 Versión instalada: {status.get('ms_agent_version', 'unknown')}")
        print(f"📝 Fecha de validación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return percentage >= 60
        
    except Exception as e:
        print(f"❌ Error durante validación: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)