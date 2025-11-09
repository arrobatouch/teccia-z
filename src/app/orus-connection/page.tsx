'use client';

import { useState } from 'react';

export default function ORUSConnectionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [containers, setContainers] = useState<any[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const discoverEcosystem = async () => {
    setIsLoading(true);
    setIsScanning(true);
    addLog('🔍 Iniciando descubrimiento del ecosistema ORUS...');
    
    // Simulación del proceso
    setTimeout(() => addLog('📡 Conectando con ORUS principal...'), 1000);
    setTimeout(() => addLog('🧠 Escaneando cerebro cognitivo...'), 2000);
    setTimeout(() => addLog('🔦 Buscando contenedores Modelscope...'), 3000);
    setTimeout(() => addLog('📚 Verificando AnythingLLM...'), 4000);
    
    setTimeout(() => {
      // Contenedores simulados
      const mockContainers = [
        { name: 'modelscope-voice', port: 8086, type: 'voice', status: 'active' },
        { name: 'modelscope-vision', port: 8087, type: 'vision', status: 'active' },
        { name: 'modelscope-reasoning', port: 8088, type: 'reasoning', status: 'active' },
      ];
      
      setContainers(mockContainers);
      addLog('✅ Descubrimiento completado exitosamente');
      addLog(`📦 Contenedores encontrados: ${mockContainers.length}`);
      mockContainers.forEach(container => {
        addLog(`  - ${container.name} (${container.type}) en puerto ${container.port}`);
      });
      
      setIsLoading(false);
      setIsScanning(false);
    }, 5000);
  };

  const sendQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    addLog(`📤 Enviando consulta: "${query}"`);
    
    setTimeout(() => {
      const mockResponse = {
        status: "success",
        message: "ORUS ha procesado tu consulta",
        data: {
          query: query,
          timestamp: new Date().toISOString(),
          containers_active: containers.length,
          processing_time: "1.2s",
          confidence: "0.95"
        }
      };
      
      setResponse(JSON.stringify(mockResponse, null, 2));
      addLog('✅ Respuesta recibida de ORUS');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className={`text-6xl ${isScanning ? 'animate-bounce' : ''}`}>🧠</div>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🧠 ORUS CONTROL CENTER
          </h1>
          <p className="text-xl text-gray-300">
            Panel de control del ecosistema cognitivo distribuido
          </p>
        </div>

        {/* Estado del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <div className="text-sm text-gray-400">ORUS Principal</div>
                <div className="text-lg font-bold text-green-400">CONECTADO</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔧</div>
              <div>
                <div className="text-sm text-gray-400">Contenedores</div>
                <div className="text-lg font-bold text-purple-400">{containers.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <div className="text-sm text-gray-400">Estado</div>
                <div className="text-lg font-bold text-yellow-400">
                  {isScanning ? 'ESCANEANDO' : 'LISTO'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💬</div>
              <div>
                <div className="text-sm text-gray-400">Consultas</div>
                <div className="text-lg font-bold text-blue-400">{response ? '1' : '0'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel de Control */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🎮</span> Control de ORUS
            </h2>
            
            <button 
              onClick={discoverEcosystem} 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isScanning ? 'ESCANEANDO...' : 'CONECTANDO...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🔍</span> DESCUBRIR ECOSISTEMA ORUS
                </span>
              )}
            </button>

            {containers.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-white font-medium">Contenedores Activos:</h3>
                {containers.map((container, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white">{container.name}</span>
                      <span className="text-xs text-gray-400">({container.type})</span>
                    </div>
                    <span className="text-xs text-gray-400">:{container.port}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel de Consulta */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💬</span> Consulta Directa
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ORUS, ¿qué contenedores tienes activos?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendQuery()}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg placeholder-gray-400"
              />
              
              <button 
                onClick={sendQuery} 
                disabled={isLoading || !query.trim()}
                className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Consulta'
                )}
              </button>
            </div>

            {response && (
              <div className="mt-4">
                <h3 className="text-white font-medium mb-2">Respuesta de ORUS:</h3>
                <div className="bg-black rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                    {response}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📟</span> Terminal de Logs
          </h2>
          
          <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm font-mono">Esperando actividad...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-xs font-mono text-green-400 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🧠 ORUS - Agente Cognitivo Multimodal | Arquitectura Distribuida</p>
          <p>🔧 Modelscope - Contenedores Especializados | 📚 AnythingLLM - Memoria Central</p>
          <p className="text-xs text-gray-500">Panel de Control v1.0 - Demostración Visual</p>
        </div>
      </div>
    </div>
  );
}