'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Server, 
  FileText, 
  Clock, 
  Terminal, 
  Code, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Database,
  Shield,
  Globe,
  Cpu,
  Activity,
  ArrowRight,
  Download,
  Play,
  Settings
} from "lucide-react";

interface Trabajo {
  id: string;
  titulo: string;
  descripcion: string;
  icono: any;
  color: string;
  estado: 'completado' | 'activo' | 'integrado';
  funcionalidades: string[];
  codigo: string;
  comandos: string[];
  archivos: string[];
  ruta: string;
}

const trabajos: Trabajo[] = [
  {
    id: 'log-analyzer',
    titulo: '🧠 Log Analyzer Module',
    descripcion: 'Analizador inteligente de logs para detectar errores y patrones anómalos en el sistema ORUS',
    icono: Brain,
    color: 'from-purple-600 to-pink-600',
    estado: 'completado',
    funcionalidades: [
      'Detección automática de 10 patrones de error',
      'Lectura segura de logs (solo lectura)',
      'Límite configurable de líneas (100 por defecto)',
      'Soporte multi-directorio (PM2 y ModelScope)',
      'Reporte JSON detallado con timestamps'
    ],
    codigo: `class LogAnalyzer:
    def __init__(self, log_dirs=None, lines_limit=100):
        self.log_dirs = log_dirs or [
            "/root/.pm2/logs/",
            "/opt/modelscope-agent/logs/"
        ]
        self.lines_limit = lines_limit
        
        # Patrones de error
        self.error_patterns = [
            r'ERROR', r'Exception', r'Traceback',
            r'Failed', r'Refused', r'Timeout'
        ]`,
    comandos: [
      'python3 log_analyzer.py',
      'python3 log_analyzer.py --json',
      'curl http://188.245.56.151:8085/logs'
    ],
    archivos: ['log_analyzer.py', 'README.md', '__init__.py'],
    ruta: '/opt/modelscope-agent/mcp/log-analyzer/'
  },
  {
    id: 'api-client',
    titulo: '🔗 ORUS API Client Suite',
    descripcion: 'Suite completo de clientes Python para comunicación con ORUS Production API',
    icono: Globe,
    color: 'from-blue-600 to-cyan-600',
    estado: 'activo',
    funcionalidades: [
      '6 versiones de cliente adaptadas',
      'Conexión a ORUS Production (188.245.56.151:8085)',
      'Endpoints: /query, /health, /time, /logs',
      'Manejo robusto de errores y timeouts',
      'Integración con TECCIA-Z'
    ],
    codigo: `class ORUSAPIClient:
    def __init__(self, base_url="http://188.245.56.151:8085"):
        self.base_url = base_url
    
    def query(self, text, source="TECCIA-Z"):
        data = json.dumps({"text": text, "source": source})
        req = urllib.request.Request(f"{self.base_url}/query", data=data)
        # ... manejo de respuesta`,
    comandos: [
      'python3 orus-api-client.py health',
      'python3 orus-api-client.py time',
      'python3 orus-api-client.py logs',
      'python3 orus-api-client.py query "ORUS, estado"'
    ],
    archivos: [
      'orus-api-client.py',
      'orus-api-client-extended.py',
      'orus-api-client-final.py',
      'orus-api-client-simple.py',
      'orus-api-client-local.py',
      'orus-api-client-working.py'
    ],
    ruta: './'
  },
  {
    id: 'txt-reader',
    titulo: '📄 TXT Reader Module',
    descripcion: 'Módulo seguro para lectura y procesamiento de archivos de texto plano',
    icono: FileText,
    color: 'from-green-600 to-emerald-600',
    estado: 'integrado',
    funcionalidades: [
      'Lectura segura de archivos .txt',
      'Límite de 1000 caracteres por seguridad',
      'Validación de formato y codificación UTF-8',
      'Control de errores integrado',
      'Integración MCP con ORUS'
    ],
    codigo: `def read_txt(file_path):
    if not os.path.exists(file_path):
        return {"error": "Archivo no encontrado"}
    
    if not file_path.endswith(".txt"):
        return {"error": "Formato no soportado"}
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    return {
        "status": "ok",
        "content": content[:1000]  # límite de seguridad
    }`,
    comandos: [
      'python3 reader_txt.py test.txt',
      'from txt_reader import read_txt',
      'result = read_txt("archivo.txt")'
    ],
    archivos: ['reader_txt.py', 'test.txt'],
    ruta: '/opt/modelscope-agent/mcp/txt-reader/'
  },
  {
    id: 'orus-api',
    titulo: '🚀 ORUS REST API',
    descripcion: 'API REST completa con endpoints para consulta, diagnóstico y gestión del sistema',
    icono: Server,
    color: 'from-red-600 to-orange-600',
    estado: 'activo',
    funcionalidades: [
      'Endpoint /query para consultas ORUS',
      'Endpoint /health para verificación',
      'Endpoint /time para timestamp',
      'Endpoint /logs integrado con Log Analyzer',
      'CORS configurado para TECCIA-Z'
    ],
    codigo: `@app.get("/time")
def get_time():
    return {"status": "ok", "server_time": datetime.utcnow().isoformat() + "Z"}

@app.get("/logs")
def get_logs_analysis():
    analyzer = LogAnalyzer()
    result = analyzer.analyze_all_logs()
    return {
        "status": "ok",
        "errors_found": [e["content"] for e in result["errors_found"]],
        "total_errors": result["total_errors"]
    }`,
    comandos: [
      'uvicorn api_orus:app --host 0.0.0.0 --port 8085',
      'curl http://188.245.56.151:8085/health',
      'curl -X POST http://188.245.56.151:8085/query -d "{\\"text\\":\\"test\\"}"'
    ],
    archivos: ['api_orus.py'],
    ruta: '/opt/modelscope-agent/'
  }
];

export default function TrabajosRealizadosPage() {
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState<Trabajo | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completado</Badge>;
      case 'activo':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Activity className="w-3 h-3 mr-1" />Activo</Badge>;
      case 'integrado':
        return <Badge className="bg-purple-500 hover:bg-purple-600"><Zap className="w-3 h-3 mr-1" />Integrado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-6xl animate-pulse">🎯</div>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🚀 Trabajos Realizados
          </h1>
          <p className="text-xl text-gray-300">
            Módulos y sistemas desarrollados para el ecosistema TECCIA-Z ORUS
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              4 Módulos Completados
            </span>
            <span className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              11 Archivos Funcionales
            </span>
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              100% Operativo
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <Globe className="w-4 h-4 mr-2" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">
              <Settings className="w-4 h-4 mr-2" />
              Detalles Técnicos
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-slate-700">
              <Code className="w-4 h-4 mr-2" />
              Código Fuente
            </TabsTrigger>
            <TabsTrigger value="commands" className="data-[state=active]:bg-slate-700">
              <Terminal className="w-4 h-4 mr-2" />
              Comandos
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {trabajos.map((trabajo) => {
                const Icon = trabajo.icono;
                return (
                  <Card 
                    key={trabajo.id} 
                    className="border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 transition-all cursor-pointer group"
                    onClick={() => setTrabajoSeleccionado(trabajo)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${trabajo.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {getEstadoBadge(trabajo.estado)}
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                        {trabajo.titulo}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {trabajo.descripcion}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FileText className="w-4 h-4" />
                          <span>{trabajo.archivos.length} archivos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Database className="w-4 h-4" />
                          <span>{trabajo.ruta}</span>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full group-hover:bg-slate-700">
                            <Play className="w-4 h-4 mr-2" />
                            Ver Detalles
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {trabajoSeleccionado ? (
              <Card className="border-2 border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${trabajoSeleccionado.color}`}>
                      <trabajoSeleccionado.icono className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">{trabajoSeleccionado.titulo}</CardTitle>
                      <CardDescription className="text-gray-300">{trabajoSeleccionado.descripcion}</CardDescription>
                    </div>
                    {getEstadoBadge(trabajoSeleccionado.estado)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Funcionalidades
                    </h3>
                    <div className="grid gap-2">
                      {trabajoSeleccionado.funcionalidades.map((func, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{func}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Archivos del Sistema
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trabajoSeleccionado.archivos.map((archivo, index) => (
                        <Badge key={index} variant="outline" className="bg-slate-700 border-slate-600">
                          {archivo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p>Selecciona un módulo para ver los detalles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            {trabajoSeleccionado ? (
              <Card className="border-2 border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Código Fuente - {trabajoSeleccionado.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                      {trabajoSeleccionado.codigo}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-400">
                    <Code className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p>Selecciona un módulo para ver el código fuente</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands" className="space-y-6">
            {trabajoSeleccionado ? (
              <Card className="border-2 border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Comandos - {trabajoSeleccionado.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trabajoSeleccionado.comandos.map((comando, index) => (
                      <div key={index} className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <div className="flex items-center justify-between">
                          <code className="text-sm text-blue-400 font-mono">{comando}</code>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(comando)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-400">
                    <Terminal className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p>Selecciona un módulo para ver los comandos disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 space-y-2 border-t border-slate-700 pt-6">
          <p>🧠 TECCIA-Z Development Team | ORUS ModelScope Agent Integration</p>
          <p>📦 Versión 2.0.2 | 🚀 4 Módulos Operativos | 🔧 11 Archivos Funcionales</p>
          <p className="text-xs text-gray-500">Panel de Trabajos Realizados - Sistema de Gestión de Proyectos</p>
        </div>
      </div>
    </div>
  );
}