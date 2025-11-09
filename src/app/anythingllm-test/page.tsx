'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Database, 
  MessageCircle, 
  CheckCircle, 
  XCircle,
  BookOpen,
  Activity,
  Zap,
  Globe,
  Shield,
  Terminal,
  Lock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function AnythingLLMTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [authStatus, setAuthStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState<string>('');
  const [systemInfo, setSystemInfo] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testAnythingLLMConnection = async () => {
    setIsLoading(true);
    setAuthStatus('connecting');
    addLog('🔐 Iniciando conexión con AnythingLLM desde backend...');
    
    try {
      // Usar endpoint del backend para evitar problemas de CORS/red
      addLog('📡 Enviando solicitud a backend...');
      const response = await fetch('/api/anythingllm-test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addLog(`📊 Respuesta recibida: ${data.success ? 'Éxito' : 'Error'} - Auth: ${data.auth ? 'OK' : 'FAIL'}`);
        
        if (data.success) {
          setAuthStatus('connected');
          addLog('✅ Autenticación exitosa con AnythingLLM');
          
          // Procesar workspaces - pueden venir en data.workspaces.workspaces o data.workspaces
          let workspaceList = [];
          if (data.workspaces && data.workspaces.workspaces) {
            workspaceList = data.workspaces.workspaces;
          } else if (data.workspaces && Array.isArray(data.workspaces)) {
            workspaceList = data.workspaces;
          }
          
          if (workspaceList.length > 0) {
            setWorkspaces(workspaceList);
            addLog(`📦 Se encontraron ${workspaceList.length} workspaces`);
          }
          
          setSystemInfo({
            auth: data.auth,
            baseUrl: data.baseUrl,
            apiKeyPrefix: data.apiKeyPrefix,
            totalWorkspaces: workspaceList.length
          });
          addLog('✅ Información del sistema obtenida');
          
        } else {
          setAuthStatus('disconnected');
          addLog(`❌ Error en conexión: ${data.error}`);
          if (data.details) {
            addLog(`📋 Detalles: ${data.details}`);
          }
        }
      } else {
        const errorText = await response.text();
        setAuthStatus('disconnected');
        addLog(`❌ Error HTTP ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      setAuthStatus('disconnected');
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Error en conexión: ${errorMessage}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedWorkspace) return;
    
    setIsLoading(true);
    addLog(`💬 Enviando mensaje a workspace "${selectedWorkspace}": "${chatMessage}"`);
    
    try {
      // Usar endpoint del backend para el chat
      const response = await fetch('/api/anythingllm-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspaceSlug: selectedWorkspace,
          message: chatMessage
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          addLog('✅ Respuesta recibida de AnythingLLM');
          setChatResponse(JSON.stringify(data.response, null, 2));
        } else {
          addLog(`❌ Error en chat: ${data.error}`);
          if (data.details) {
            addLog(`📋 Detalles: ${data.details}`);
          }
          setChatResponse(`Error: ${data.error}`);
        }
      } else {
        const errorText = await response.text();
        addLog(`❌ Error HTTP ${response.status}: ${errorText}`);
        setChatResponse(`Error HTTP ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Error enviando mensaje: ${errorMessage}`);
      setChatResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-left space-y-4">
          <div className="flex items-center justify-start gap-4">
            <div className="text-6xl">📚</div>
            <div className="flex gap-2">
              <div className={`w-4 h-4 rounded-full animate-pulse ${
                authStatus === 'connected' ? 'bg-green-400' : 
                authStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            📚 AnythingLLM Real Connection
          </h1>
          <p className="text-xl text-gray-300">
            Conexión real con AnythingLLM usando API Key
          </p>
          
          <div className="flex items-center justify-start gap-2">
            <Lock className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm">API Key: HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N</span>
          </div>
        </div>

        {/* Estado de Conexión */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-green-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {authStatus === 'connected' ? <Wifi className="h-8 w-8 text-green-400" /> : <WifiOff className="h-8 w-8 text-red-400" />}
                <div>
                  <div className="text-sm text-gray-400">Estado AnythingLLM</div>
                  <div className="text-lg font-bold text-green-400">
                    {authStatus === 'connected' ? 'CONECTADO' : 
                     authStatus === 'connecting' ? 'CONECTANDO' : 'DESCONECTADO'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-blue-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Workspaces</div>
                  <div className="text-lg font-bold text-blue-400">{workspaces.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-purple-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Sistema</div>
                  <div className="text-lg font-bold text-purple-400">
                    {systemInfo ? 'ACTIVO' : 'DESCONOCIDO'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Control */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Conexión */}
          <Card className="bg-slate-800 border-green-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-6 w-6 text-green-400" />
                Conexión AnythingLLM
              </CardTitle>
              <CardDescription className="text-gray-400">
                Conexión real con AnythingLLM usando API Key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={testAnythingLLMConnection} 
                disabled={isLoading}
                className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    {authStatus === 'connecting' ? 'CONECTANDO...' : 'PROCESANDO...'}
                  </>
                ) : (
                  <>
                    <Database className="mr-3 h-6 w-6" />
                    CONECTAR CON ANYTHINGLLM
                  </>
                )}
              </Button>

              {systemInfo && (
                <div className="space-y-3">
                  <Separator className="bg-slate-700" />
                  <h4 className="text-white font-medium">Información del Sistema:</h4>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <pre className="text-xs text-green-400 font-mono">
                      {JSON.stringify(systemInfo, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workspaces */}
          <Card className="bg-slate-800 border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="h-6 w-6 text-blue-400" />
                Workspaces Disponibles
              </CardTitle>
              <CardDescription className="text-gray-400">
                Espacios de trabajo de AnythingLLM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workspaces.length > 0 ? (
                <div className="space-y-2">
                  {workspaces.map((workspace, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedWorkspace === workspace.slug 
                          ? 'bg-blue-900 border-blue-400' 
                          : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      }`}
                      onClick={() => setSelectedWorkspace(workspace.slug)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{workspace.name}</div>
                          <div className="text-xs text-gray-400">Slug: {workspace.slug}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {selectedWorkspace === workspace.slug ? 'Seleccionado' : 'Seleccionar'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay workspaces disponibles</p>
                  <p className="text-sm">Conecta primero con AnythingLLM</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        {selectedWorkspace && (
          <Card className="bg-slate-800 border-purple-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageCircle className="h-6 w-6 text-purple-400" />
                Chat con Workspace: {selectedWorkspace}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Conversación directa con el workspace seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe tu mensaje para AnythingLLM..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
                <Button 
                  onClick={sendChatMessage} 
                  disabled={isLoading || !chatMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Enviar'
                  )}
                </Button>
              </div>

              {chatResponse && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Respuesta de AnythingLLM:</h4>
                  <ScrollArea className="h-48 w-full bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {chatResponse}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Logs */}
        <Card className="bg-slate-800 border-green-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Terminal className="h-6 w-6 text-green-400" />
              Logs de Conexión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full bg-black border border-green-900 rounded-lg p-4">
              <div className="space-y-1">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-sm font-mono">Esperando conexión con AnythingLLM...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono text-green-400">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-left text-sm text-gray-400 space-y-1">
          <p>📚 AnythingLLM Real Connection - TECCIA-Z</p>
          <p>🔐 API Key: HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N</p>
          <p>🌐 Endpoint: https://orus.teccia.com.ar</p>
        </div>
      </div>
    </div>
  );
}