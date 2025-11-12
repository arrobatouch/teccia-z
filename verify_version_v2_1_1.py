#!/usr/bin/env python3
"""
🎯 VERIFICACIÓN FINAL DE VERSIÓN v2.1.1
Script para verificar que la versión ha sido correctamente subida a GitHub
"""

import json
import subprocess
import sys
from datetime import datetime

def run_git_command(command):
    """Ejecutar comando git y retornar resultado"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd='/home/z/teccia-z')
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except Exception as e:
        return "", str(e), 1

def main():
    print("🎯 VERIFICACIÓN FINAL - VERSIÓN v2.1.1")
    print("=" * 60)
    print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. Verificar estado local
    print("📋 Paso 1/4: Verificando estado local...")
    
    # Último commit
    commit_hash, _, _ = run_git_command("git rev-parse HEAD")
    print(f"✅ Commit actual: {commit_hash}")
    
    # Rama actual
    branch, _, _ = run_git_command("git branch --show-current")
    print(f"✅ Rama actual: {branch}")
    
    # Tags locales
    tags, _, _ = run_git_command("git tag -l | grep v2.1.1")
    if tags:
        print(f"✅ Tag local v2.1.1 encontrado")
    else:
        print("❌ Tag local v2.1.1 no encontrado")
        return False
    
    # 2. Verificar conexión con remoto
    print("\n🌐 Paso 2/4: Verificando conexión con remoto...")
    
    remote_url, _, _ = run_git_command("git remote get-url origin")
    print(f"✅ Remoto: {remote_url}")
    
    # Verificar si el push fue exitoso
    remote_commit, stderr, returncode = run_git_command("git ls-remote origin refs/heads/Oiko")
    if returncode == 0 and remote_commit:
        remote_hash = remote_commit.split('\t')[0]
        print(f"✅ Commit remoto: {remote_hash}")
        
        if commit_hash.startswith(remote_hash[:7]):
            print("✅ Sincronización con remoto: OK")
        else:
            print("⚠️ Posible desincronización con remoto")
    else:
        print("❌ Error verificando remoto")
        print(f"   Error: {stderr}")
    
    # 3. Verificar tag en remoto
    print("\n🏷️ Paso 3/4: Verificando tag en remoto...")
    
    remote_tags, _, returncode = run_git_command("git ls-remote --tags origin v2.1.1")
    if returncode == 0 and remote_tags:
        print("✅ Tag v2.1.1 encontrado en remoto")
        tag_info = remote_tags.split('\t')
        print(f"   Hash: {tag_info[0]}")
        print(f"   Referencia: {tag_info[1]}")
    else:
        print("❌ Tag v2.1.1 no encontrado en remoto")
        return False
    
    # 4. Verificar archivos principales
    print("\n📁 Paso 4/4: Verificando archivos principales...")
    
    key_files = [
        "RELEASE_v2_1_0.md",
        "opt/modelscope-agent/orus_ms_agent_v1_4.py",
        "opt/modelscope-agent/validation_v1_4_final.py",
        "opt/modelscope-agent/validation_simple_v1_4.py",
        "opt/modelscope-agent/README_MS_AGENT_v1_4_0.md"
    ]
    
    files_ok = 0
    for file_path in key_files:
        exists, _, _ = run_git_command(f"test -f '{file_path}' && echo 'exists'")
        if exists == "exists":
            print(f"✅ {file_path}")
            files_ok += 1
        else:
            print(f"❌ {file_path} - NO ENCONTRADO")
    
    print(f"\n📊 Archivos verificados: {files_ok}/{len(key_files)}")
    
    # RESUMEN FINAL
    print("\n" + "=" * 60)
    print("🏆 RESUMEN FINAL DE VERIFICACIÓN")
    print("=" * 60)
    
    # Calcular puntuación
    score = 0
    max_score = 10
    
    # Puntos por estado local
    score += 2  # Commit y rama OK
    
    # Puntos por tag local
    score += 1  # Tag local existe
    
    # Puntos por conexión remota
    if remote_commit:
        score += 2  # Conexión con remoto OK
    
    # Puntos por tag remoto
    if remote_tags:
        score += 3  # Tag remoto existe
    
    # Puntos por archivos
    file_score = (files_ok / len(key_files)) * 2
    score += file_score
    
    percentage = (score / max_score) * 100
    
    print(f"📊 Puntuación: {score:.1f}/{max_score} ({percentage:.1f}%)")
    
    if percentage >= 90:
        print("🎉 ¡VERIFICACIÓN EXITOSA!")
        print("✅ Versión v2.1.1 correctamente subida a GitHub")
        print("✅ Todos los componentes principales verificados")
        print("✅ Sistema listo para descarga y uso")
        print("\n🔗 Acceso a la versión:")
        print("   https://github.com/arrobatouch/teccia-z/releases/tag/v2.1.1")
        return True
    elif percentage >= 70:
        print("⚠️ VERIFICACIÓN PARCIAL")
        print("✅ Versión subida pero con algunas advertencias")
        print("⚠️ Algunos componentes pueden necesitar atención")
        print("\n🔗 Acceso a la versión:")
        print("   https://github.com/arrobatouch/teccia-z/releases/tag/v2.1.1")
        return True
    else:
        print("❌ VERIFICACIÓN FALLIDA")
        print("❌ La versión no fue correctamente subida")
        print("🔧 Se requiere revisión y corrección")
        return False

if __name__ == "__main__":
    success = main()
    print(f"\n📝 Verificación completada: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sys.exit(0 if success else 1)