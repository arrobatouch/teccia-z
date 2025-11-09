#!/usr/bin/env python3
"""
ORUS API - Versión simplificada para pruebas
"""

from datetime import datetime
import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

class ORUSAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/time":
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                "status": "ok", 
                "server_time": datetime.utcnow().isoformat() + "Z"
            }
            
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        # Test directo del endpoint /time
        response = {
            "status": "ok", 
            "server_time": datetime.utcnow().isoformat() + "Z"
        }
        print(json.dumps(response, indent=2))
    else:
        # Iniciar servidor HTTP
        server = HTTPServer(('localhost', 8085), ORUSAPIHandler)
        print("Servidor ORUS API iniciado en http://localhost:8085")
        server.serve_forever()