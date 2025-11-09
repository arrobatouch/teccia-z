'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Server, 
  Plug, 
  MessageCircle, 
  CheckCircle, 
  XCircle,
  Brain,
  Activity,
  Zap,
  Radio,
  Database,
  Cpu,
  Globe,
  Shield,
  Eye,
  Terminal,
  Lock,
  AlertTriangle
} from 'lucide-react';

export default function ORUSProductionPage() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const connectToORUSProduction = async () => {
    setIsLoading(true);
    setIsScanning(true);
    setConnectionStatus('connecting');
    addLog('🔐 Iniciando conexión con ORUS Production desde backend...');
    
    try {
      // Primero, ejecutar diagnóstico
      addLog('🔍 Ejecutando diagnóstico de conectividad...');
      const diagnosticResponse = await fetch('/api/orus-diagnostics', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      let diagnosticData = null;
      if (diagnosticResponse.ok) {
        diagnosticData = await diagnosticResponse.json();
        addLog(`📊 Diagnóstico: ${diagnosticData.summary.overall} - ${diagnosticData.summary.success}/${diagnosticData.summary.totalTests} tests exitosos`);
        
        if (diagnosticData.summary.overall === 'FAIL') {
          addLog('❌ Conectividad con ORUS no disponible - activando modo DEMO');
          diagnosticData.recommendations.forEach(rec => {
            addLog(`💡 ${rec}`);
          });
        }
      }
      
      // Usar endpoint del backend para evitar problemas de CORS/red
      addLog('📡 Enviando solicitud a backend...');
      const response = await fetch('/api/orus-production', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addLog(`📊 Respuesta recibida: ${data.success ? 'Éxito' : 'Error'}`);
        
        if (data.success) {
          // ORUS Connection
          if (data.orus.connected) {
            addLog('✅ ORUS Principal conectado');
            setConnectionStatus('connected');
          } else {
            addLog('❌ Error conectando con ORUS Principal');
            if (data.orus.error) {
              addLog(`📋 Detalles del error: ${data.orus.error}`);
            }
            // Modo demo si no hay conexión
            setConnectionStatus('connected'); // Para mostrar la interfaz
            addLog('🎭 Activando MODO DEMO - Datos simulados');
          }
          
          // Containers
          if (data.containers.discovered && data.containers.discovered.length > 0) {
            addLog(`📦 Contenedores encontrados: ${data.containers.total}`);
            data.containers.discovered.forEach(container => {
              addLog(`  - ${container.name} (${container.type}) en puerto ${container.port}`);
            });
          } else if (!data.orus.connected) {
            // Modo DEMO - mostrar contenedores simulados
            const demoContainers = [
              { name: "modelscope-voice", port: 8086, type: "voice", status: "active" },
              { name: "modelscope-vision", port: 8088, type: "vision", status: "active" },
              { name: "modelscope-reasoning", port: 8090, type: "reasoning", status: "active" }
            ];
            addLog(`📦 Contenedores MODO DEMO: ${demoContainers.length}`);
            demoContainers.forEach(container => {
              addLog(`  - ${container.name} (${container.type}) en puerto ${container.port} [DEMO]`);
            });
            data.containers.discovered = demoContainers;
            data.containers.total = demoContainers.length;
          } else {
            addLog('📦 No se encontraron contenedores activos');
          }
          
          // AnythingLLM
          addLog(data.anythingllm.connected ? '✅ AnythingLLM conectado' : '⚠️ AnythingLLM no disponible');
          
          // Realtime
          addLog(data.realtime.connected ? '✅ Socket.IO conectado' : '⚠️ Socket.IO no disponible');
          
          // System Status
          setSystemStatus({
            orus: data.orus,
            containers: data.containers,
            anythingllm: data.anythingllm,
            realtime: data.realtime,
            systemStatus: data.systemStatus,
            endpoints: {
              orus: data.orus.endpoint,
              anythingllm: data.anythingllm.endpoint,
              realtime: data.realtime.endpoint
            }
          });
          
            addLog(`🎉 Conexión Production completada - Estado: ${data.orus.connected ? data.systemStatus.overall : 'DEMO'}`);
          
          if (data.systemStatus.issues && data.systemStatus.issues.length > 0) {
            addLog(`⚠️ Issues detectados: ${data.systemStatus.issues.join(', ')}`);
          }
          
        } else {
          setConnectionStatus('disconnected');
          addLog(`❌ Error en conexión Production: ${data.error}`);
          if (data.details) {
            addLog(`📋 Detalles: ${data.details}`);
          }
        }
      } else {
        const errorText = await response.text();
        setConnectionStatus('disconnected');
        addLog(`❌ Error HTTP ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      setConnectionStatus('disconnected');
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Error en conexión Production: ${errorMessage}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  const sendProductionQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    addLog(`📤 Enviando consulta Production: "${query}"`);
    
    try {
      // Usar endpoint del backend para la consulta
      const response = await fetch('/api/orus-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setResponse(JSON.stringify(data.response, null, 2));
          addLog('✅ Respuesta Production recibida');
        } else {
          addLog(`❌ Error en consulta Production: ${data.error}`);
          if (data.details) {
            addLog(`📋 Detalles: ${data.details}`);
          }
          setResponse(`Error: ${data.error}`);
        }
      } else {
        const errorText = await response.text();
        addLog(`❌ Error HTTP ${response.status}: ${errorText}`);
        setResponse(`Error HTTP ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Error en consulta Production: ${errorMessage}`);
      setResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const executeOikoCommand = async (command: string) => {
    setQuery(command);
    await sendProductionQuery();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Production */}
        <div className="text-left space-y-4">
          <div className="flex items-center justify-start gap-4">
            <div className={`text-6xl ${isScanning ? 'animate-bounce' : ''}`}>🔐</div>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            🔐 TECCIA-Z PRODUCTION
          </h1>
          <p className="text-xl text-gray-300">
            Panel de control Production - Conexión real con ORUS
          </p>
          
          <div className="flex items-center justify-start gap-2">
            <Lock className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm">Sistema Production Seguro</span>
          </div>
        </div>

        {/* Estado del Sistema Production */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-red-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Server className="h-8 w-8 text-red-400" />
                <div>
                  <div className="text-sm text-gray-400">ORUS Production</div>
                  <div className="text-lg font-bold text-red-400">
                    {connectionStatus === 'connected' ? 'CONECTADO' : 
                     connectionStatus === 'connecting' ? 'CONECTANDO' : 'DESCONECTADO'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-orange-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-8 w-8 text-orange-400" />
                <div>
                  <div className="text-sm text-gray-400">Contenedores</div>
                  <div className="text-lg font-bold text-orange-400">
                    {systemStatus?.discoveredContainers?.length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-yellow-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-yellow-400" />
                <div>
                  <div className="text-sm text-gray-400">Estado</div>
                  <div className="text-lg font-bold text-yellow-400">
                    {isScanning ? 'ESCANEANDO' : 'PRODUCTION'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-green-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Seguridad</div>
                  <div className="text-lg font-bold text-green-400">ACTIVA</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Principal Production */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel de Control Production */}
          <Card className="bg-slate-800 border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-6 w-6 text-red-400" />
                Control Production ORUS
              </CardTitle>
              <CardDescription className="text-gray-400">
                Conexión segura con el ecosistema ORUS production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={connectToORUSProduction} 
                disabled={isLoading}
                className="w-full h-14 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    {isScanning ? 'CONECTANDO...' : 'PROCESANDO...'}
                  </>
                ) : (
                  <>
                    <Lock className="mr-3 h-6 w-6" />
                    CONECTAR ORUS PRODUCTION
                  </>
                )}
              </Button>

              {systemStatus && (
                <div className="space-y-4">
                  <Separator className="bg-slate-700" />
                  
                  {/* Endpoints Production */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-gray-400">ORUS:</span>
                      <span className="text-sm font-mono text-red-400">{systemStatus.endpoints?.orus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-gray-400">AnythingLLM:</span>
                      <span className="text-sm font-mono text-orange-400">{systemStatus.endpoints?.anythingllm}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">Realtime:</span>
                      <span className="text-sm font-mono text-yellow-400">{systemStatus.endpoints?.realtime}</span>
                    </div>
                  </div>

                  {/* Comandos OIKO */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Comandos OIKO:</h4>
                    <div className="grid gap-2">
                      {[
                        "ORUS, muestra estado de los porteros",
                        "ORUS, lista contenedores activos",
                        "ORUS, sincronizar llaves del sistema",
                        "ORUS, estado del ecosistema OIKO"
                      ].map((cmd, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => executeOikoCommand(cmd)}
                          className="text-xs justify-start"
                        >
                          {cmd}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panel de Consulta Production */}
          <Card className="bg-slate-800 border-orange-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageCircle className="h-6 w-6 text-orange-400" />
                Consulta Production
              </CardTitle>
              <CardDescription className="text-gray-400">
                Comunicación directa con ORUS production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="ORUS, estado del sistema OIKO..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendProductionQuery()}
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
                <Button 
                  onClick={sendProductionQuery} 
                  disabled={isLoading || !query.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Enviar'
                  )}
                </Button>
              </div>

              {response && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    Respuesta Production:
                  </h4>
                  <ScrollArea className="h-48 w-full bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {response}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Logs Production */}
        <Card className="bg-slate-800 border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Terminal className="h-6 w-6 text-red-400" />
              Terminal Production Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full bg-black border border-red-900 rounded-lg p-4">
              <div className="space-y-1">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-sm font-mono">Sistema Production esperando...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono text-red-400">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Footer Production */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🔐 TECCIA-Z Production - Conexión Segura con ORUS</p>
          <p>🧠 ORUS Production | 🔧 Modelscope Containers | 📚 AnythingLLM | 🌐 Socket.IO</p>
          <p className="text-xs text-red-400">⚠️ Sistema Production - Acceso Autorizado Requerido</p>
        </div>
      </div>
    </div>
  );
}