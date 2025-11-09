#!/usr/bin/env python3
"""
ORUS Log Analyzer
Analizador de logs para detectar errores y excepciones en el sistema ORUS
"""

import os
import re
from datetime import datetime
from typing import List, Dict, Optional
import glob

class LogAnalyzer:
    """Clase principal para análisis de logs del sistema ORUS"""
    
    def __init__(self, log_dirs: List[str] = None, lines_limit: int = 100):
        """
        Inicializar el analizador de logs
        
        Args:
            log_dirs: Lista de directorios de logs a analizar
            lines_limit: Límite de líneas a leer por archivo (por defecto 100)
        """
        self.log_dirs = log_dirs or [
            "/root/.pm2/logs/",
            "/opt/modelscope-agent/logs/"
        ]
        self.lines_limit = lines_limit
        
        # Patrones de error a buscar
        self.error_patterns = [
            r'ERROR',
            r'Exception',
            r'Traceback',
            r'Failed',
            r'Refused',
            r'Connection reset',
            r'Timeout',
            r'Error',
            r'CRITICAL',
            r'FATAL'
        ]
        
        # Compilar patrones para mejor rendimiento
        self.compiled_patterns = [re.compile(pattern, re.IGNORECASE) for pattern in self.error_patterns]
    
    def read_last_lines(self, file_path: str, limit: int = None) -> List[str]:
        """
        Leer las últimas N líneas de un archivo
        
        Args:
            file_path: Ruta del archivo
            limit: Límite de líneas a leer
            
        Returns:
            Lista de las últimas líneas del archivo
        """
        if not os.path.exists(file_path):
            return []
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                return lines[-(limit or self.lines_limit):]
        except Exception as e:
            print(f"Error leyendo archivo {file_path}: {e}")
            return []
    
    def find_errors_in_lines(self, lines: List[str], file_name: str) -> List[Dict[str, str]]:
        """
        Buscar patrones de error en una lista de líneas
        
        Args:
            lines: Líneas a analizar
            file_name: Nombre del archivo para referencia
            
        Returns:
            Lista de errores encontrados
        """
        errors = []
        
        for line_num, line in enumerate(lines, 1):
            line_content = line.strip()
            if not line_content:
                continue
                
            for pattern in self.compiled_patterns:
                if pattern.search(line_content):
                    errors.append({
                        'file': file_name,
                        'line_number': line_num,
                        'content': line_content,
                        'pattern': pattern.pattern,
                        'timestamp': datetime.now().isoformat() + "Z"
                    })
                    break  # Solo registrar una vez por línea
        
        return errors
    
    def analyze_log_file(self, file_path: str) -> List[Dict[str, str]]:
        """
        Analizar un archivo de log específico
        
        Args:
            file_path: Ruta del archivo a analizar
            
        Returns:
            Lista de errores encontrados en el archivo
        """
        file_name = os.path.basename(file_path)
        lines = self.read_last_lines(file_path)
        return self.find_errors_in_lines(lines, file_name)
    
    def analyze_all_logs(self) -> Dict[str, any]:
        """
        Analizar todos los logs en los directorios configurados
        
        Returns:
            Diccionario con resultados del análisis
        """
        all_errors = []
        analyzed_files = []
        skipped_files = []
        
        for log_dir in self.log_dirs:
            if not os.path.exists(log_dir):
                print(f"⚠️  Directorio no encontrado: {log_dir}")
                skipped_files.append(f"{log_dir} (directorio no existe)")
                continue
            
            # Buscar todos los archivos .log en el directorio
            log_files = glob.glob(os.path.join(log_dir, "*.log"))
            
            if not log_files:
                skipped_files.append(f"{log_dir} (sin archivos .log)")
                continue
            
            for log_file in log_files:
                try:
                    file_errors = self.analyze_log_file(log_file)
                    all_errors.extend(file_errors)
                    analyzed_files.append(os.path.basename(log_file))
                except Exception as e:
                    skipped_files.append(f"{os.path.basename(log_file)} (error: {str(e)})")
        
        return {
            'timestamp': datetime.now().isoformat() + "Z",
            'total_errors': len(all_errors),
            'errors_found': all_errors,
            'analyzed_files': analyzed_files,
            'skipped_files': skipped_files,
            'log_directories': self.log_dirs,
            'lines_limit': self.lines_limit
        }
    
    def get_summary(self, analysis_result: Dict[str, any]) -> str:
        """
        Generar un resumen legible del análisis
        
        Args:
            analysis_result: Resultado del análisis
            
        Returns:
            String con el resumen formateado
        """
        timestamp = analysis_result['timestamp']
        total_errors = analysis_result['total_errors']
        errors = analysis_result['errors_found']
        
        summary = f"🕓 Análisis ejecutado: {timestamp}\n"
        
        if total_errors == 0:
            summary += "✅ No se detectaron errores recientes\n"
        else:
            summary += f"🚨 Se encontraron {total_errors} errores:\n"
            for error in errors:
                summary += f"[{error['file']}] {error['content']}\n"
        
        if analysis_result['analyzed_files']:
            summary += f"\n📁 Archivos analizados: {', '.join(analysis_result['analyzed_files'])}\n"
        
        if analysis_result['skipped_files']:
            summary += f"⚠️  Archivos omitidos: {', '.join(analysis_result['skipped_files'])}\n"
        
        return summary

def main():
    """Función principal para ejecución desde línea de comandos"""
    analyzer = LogAnalyzer()
    result = analyzer.analyze_all_logs()
    print(analyzer.get_summary(result))
    
    # Opcional: guardar resultado en JSON
    if '--json' in sys.argv:
        import json
        with open('log_analysis_result.json', 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\n📄 Resultado guardado en log_analysis_result.json")

if __name__ == "__main__":
    import sys
    main()