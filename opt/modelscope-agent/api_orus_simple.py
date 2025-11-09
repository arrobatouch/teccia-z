#!/usr/bin/env python3
"""
ORUS API - Versión Simplificada sin FastAPI para pruebas
Endpoints principales para consulta y gestión del sistema
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime
import json
import urllib.parse

class ORUSAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Manejar peticiones GET"""
        if self.path == '/':
            self.send_json_response({
                "message": "ORUS API - Sistema Cognitivo Distribuido",
                "version": "1.0.0",
                "status": "running"
            })
        elif self.path == '/health':
            self.send_json_response({
                "status": "ok",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "service": "ORUS-API",
                "version": "1.0.0"
            })
        elif self.path == '/time':
            self.send_json_response({
                "status": "ok", 
                "server_time": datetime.utcnow().isoformat() + "Z"
            })
        elif self.path == '/logs':
            # Simular análisis de logs para prueba
            test_errors = [
                "[test.log] ERROR: Connection refused to database server",
                "[test.log] Exception: Null pointer exception in module X"
            ]
            
            self.send_json_response({
                "status": "ok",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "errors_found": test_errors,
                "total_errors": len(test_errors),
                "analyzed_files": ["test.log"],
                "skipped_files": []
            })
        else:
            self.send_error(404, "Endpoint no encontrado")
    
    def do_POST(self):
        """Manejar peticiones POST"""
        if self.path == '/query':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                text = data.get("text", "")
                source = data.get("source", "unknown")
                
                # Simulación de procesamiento ORUS
                response_text = f"ORUS ha procesado: '{text}' desde {source}"
                
                self.send_json_response({
                    "status": "ok",
                    "message": response_text,
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "source": source
                })
            except Exception as e:
                self.send_json_response({
                    "status": "error",
                    "error": str(e),
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                })
        else:
            self.send_error(404, "Endpoint no encontrado")
    
    def send_json_response(self, data, status_code=200):
        """Enviar respuesta JSON"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = json.dumps(data, indent=2)
        self.wfile.write(response_data.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Sobreescribir para reducir logs"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def run_server():
    """Iniciar servidor ORUS API"""
    server_address = ('127.0.0.1', 8085)
    httpd = HTTPServer(server_address, ORUSAPIHandler)
    
    print("🚀 ORUS API Server iniciado")
    print("📍 http://127.0.0.1:8085")
    print("🔍 Endpoints disponibles:")
    print("   GET  /        - Estado del servidor")
    print("   GET  /health  - Health check")
    print("   GET  /time    - Hora actual")
    print("   GET  /logs    - Análisis de logs")
    print("   POST /query   - Consultas a ORUS")
    print("⏹️  Presiona Ctrl+C para detener")
    print("=" * 50)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
        httpd.server_close()

if __name__ == "__main__":
    run_server()