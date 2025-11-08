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
  const [isConnected, setIsConnected] = useState(false);
  const [isBlackScreen, setIsBlackScreen] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const connectToORUSProduction = async () => {
    setIsLoading(true);
    setIsScanning(true);
    setConnectionStatus('connecting');
    setIsBlackScreen(true);
    addLog('🔐 Iniciando conexión con ORUS Production...');
    
    try {
      // Importar conector de producción
      const { orusProductionConnector } = await import('@/lib/orus-production-connector');
      
      // 1. Conectar con ORUS principal
      addLog('🧠 Conectando con ORUS principal...');
      const orusConnected = await orusProductionConnector.connectToORUS();
      
      if (orusConnected) {
        addLog('✅ ORUS Principal conectado');
        setConnectionStatus('connected');
        setIsConnected(true);
        
        // 2. Descubrir contenedores Modelscope
        addLog('🔦 Buscando contenedores Modelscope...');
        const containers = await orusProductionConnector.discoverModelscopeContainers();
        addLog(`📦 Contenedores encontrados: ${containers.length}`);
        
        containers.forEach(container => {
          addLog(`  - ${container.name} (${container.type}) en puerto ${container.port}`);
        });
        
        // 3. Conectar con AnythingLLM
        addLog('📚 Conectando con AnythingLLM...');
        const anythingllmConnected = await orusProductionConnector.connectToAnythingLLM();
        addLog(anythingllmConnected ? '✅ AnythingLLM conectado' : '⚠️ AnythingLLM no disponible');
        
        // 4. Probar conexión Realtime
        addLog('🌐 Probando conexión Socket.IO...');
        const realtimeConnected = await orusProductionConnector.testRealtimeConnection();
        addLog(realtimeConnected ? '✅ Socket.IO conectado' : '⚠️ Socket.IO no disponible');
        
        // 5. Obtener estado completo
        const status = await orusProductionConnector.getSystemStatus();
        setSystemStatus(status);
        
        addLog('🎉 Conexión Production completada');
        
        // Mantener conexión con health checks
        setTimeout(() => {
          setIsLoading(false);
          setIsScanning(false);
        }, 3000);
        
      } else {
        addLog('❌ Error conectando con ORUS Principal');
        setConnectionStatus('disconnected');
        setIsConnected(false);
        setIsLoading(false);
        setIsScanning(false);
        setIsBlackScreen(false);
      }
      
    } catch (error) {
      addLog(`❌ Error en conexión Production: ${error}`);
      console.error('Error:', error);
      setConnectionStatus('disconnected');
      setIsConnected(false);
      setIsLoading(false);
      setIsScanning(false);
      setIsBlackScreen(false);
    }
  };

  const sendProductionQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    addLog(`📤 Enviando consulta Production: "${query}"`);
    
    try {
      const { orusProductionConnector } = await import('@/lib/orus-production-connector');
      const result = await orusProductionConnector.queryORUS(query);
      
      setResponse(JSON.stringify(result, null, 2));
      addLog('✅ Respuesta Production recibida');
      
    } catch (error) {
      addLog(`❌ Error en consulta Production: ${error}`);
      setResponse(`Error: ${error}`);
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
      {/* Black Screen Overlay */}
      {isBlackScreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">🔐</div>
            <div className="text-2xl text-white">CONECTANDO CON ORUS PRODUCTION</div>
            <div className="text-lg text-gray-400">Por favor, espere...</div>
            <div className="w-16 h-1 bg-red-600 animate-pulse mx-auto"></div>
          </div>
        </div>
      )}
      
      <div className={`max-w-7xl mx-auto space-y-8 ${isBlackScreen ? 'opacity-0' : ''}`}>
        
        {/* Header Production */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
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
          
          <div className="flex items-center justify-center gap-2">
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
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isScanning ? 'CONECTANDO...' : 'PROCESANDO...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="mr-3 h-6 w-6" />
                    CONECTAR ORUS PRODUCTION
                  </span>
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
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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