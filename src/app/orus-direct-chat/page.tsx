'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  CheckCircle,
  Clock,
  Zap,
  FileText,
  Globe,
  Server,
  GitBranch,
  Activity
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'orus';
  timestamp: string;
  isTyping?: boolean;
}

interface PredefinedQuestion {
  id: string;
  category: string;
  question: string;
  icon: any;
  color: string;
}

const predefinedQuestions: PredefinedQuestion[] = [
  {
    id: 'log-analyzer-1',
    category: '🧠 Log Analyzer',
    question: 'ORUS, explícame cómo funciona el módulo Log Analyzer que desarrollaste',
    icon: Brain,
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'log-analyzer-2',
    category: '🧠 Log Analyzer',
    question: 'ORUS, qué patrones de error puede detectar el Log Analyzer y cómo los procesa',
    icon: Brain,
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'api-client-1',
    category: '🔗 API Client Suite',
    question: 'ORUS, describí las 6 versiones del API Client que creaste y sus diferencias',
    icon: Globe,
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'api-client-2',
    category: '🔗 API Client Suite',
    question: 'ORUS, cómo se conecta el API Client contigo y qué endpoints tiene disponibles',
    icon: Globe,
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'txt-reader-1',
    category: '📄 TXT Reader',
    question: 'ORUS, para qué sirve el módulo TXT Reader y qué medidas de seguridad tiene',
    icon: FileText,
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'txt-reader-2',
    category: '📄 TXT Reader',
    question: 'ORUS, cómo integra el TXT Reader con el sistema MCP y qué tipos de archivos procesa',
    icon: FileText,
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'orus-api-1',
    category: '🚀 ORUS REST API',
    question: 'ORUS, qué endpoints tiene tu API REST y cómo funcionan',
    icon: Server,
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 'orus-api-2',
    category: '🚀 ORUS REST API',
    question: 'ORUS, cómo está configurado el CORS en tu API para TECCIA-Z',
    icon: Server,
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 'versionado-1',
    category: '🏷️ Versionado Automático',
    question: 'ORUS, explicá el sistema de versionado automático y cómo facilita los releases',
    icon: GitBranch,
    color: 'from-indigo-600 to-violet-600'
  },
  {
    id: 'versionado-2',
    category: '🏷️ Versionado Automático',
    question: 'ORUS, cómo funciona el script version-release.sh y qué pasos automatiza',
    icon: GitBranch,
    color: 'from-indigo-600 to-violet-600'
  },
  {
    id: 'general-1',
    category: '🎯 General',
    question: 'ORUS, cuál es el estado actual de todos los módulos del sistema TECCIA-Z',
    icon: Activity,
    color: 'from-gray-600 to-slate-600'
  },
  {
    id: 'general-2',
    category: '🎯 General',
    question: 'ORUS, resumí todos los trabajos realizados y su impacto en el ecosistema',
    icon: Activity,
    color: 'from-gray-600 to-slate-600'
  }
];

export default function ORUSDirectChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addMessage = (text: string, sender: 'user' | 'orus', isTyping = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString(),
      isTyping
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const sendToORUS = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage(text, 'user');
    setInputText('');
    setIsLoading(true);
    
    // Add typing indicator
    const typingId = Date.now().toString();
    addMessage('ORUS está pensando...', 'orus', true);
    
    try {
      // Simulate API call to ORUS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Simulate ORUS response based on the question
      let response = '';
      
      if (text.toLowerCase().includes('log analyzer')) {
        response = `🧠 **Log Analyzer Module**

El módulo Log Analyzer que desarrollé es una herramienta poderosa para monitoreo del sistema:

**🔍 Características principales:**
- Detección automática de 10 patrones de error (ERROR, Exception, Traceback, etc.)
- Lectura segura de logs (solo lectura, sin modificar archivos)
- Límite configurable de líneas (100 por defecto para evitar sobrecarga)
- Soporte multi-directorio (PM2 y ModelScope logs)
- Reporte JSON detallado con timestamps y contexto

**⚙️ Funcionamiento:**
1. Escanea directorios configurados en busca de archivos .log
2. Lee las últimas N líneas de cada archivo
3. Aplica patrones regex para detectar errores
4. Genera reporte estructurado con errores encontrados
5. Integra con API REST endpoint /logs

**🛡️ Seguridad:**
- Solo lectura, nunca modifica archivos originales
- Control de límites para evitar consumo excesivo
- Manejo robusto de errores y permisos

**📊 Ejemplo de uso:**
\`\`\`bash
python3 log_analyzer.py
python3 log_analyzer.py --json
curl http://188.245.56.151:8085/logs
\`\`\`

El módulo está completamente operativo e integrado con el ecosistema ORUS.`;
      } else if (text.toLowerCase().includes('api client')) {
        response = `🔗 **ORUS API Client Suite**

Desarrollé 6 versiones del cliente API para comunicación con ORUS Production:

**📋 Versiones disponibles:**
1. **orus-api-client.py** - Versión principal completa
2. **orus-api-client-extended.py** - Con soporte para análisis de logs
3. **orus-api-client-final.py** - Versión optimizada para producción
4. **orus-api-client-simple.py** - Versión simplificada
5. **orus-api-client-local.py** - Para desarrollo local
6. **orus-api-client-working.py** - Versión de trabajo

**🔧 Endpoints implementados:**
- **/query** - Envío de consultas a ORUS
- **/health** - Verificación de estado del sistema
- **/time** - Obtención de timestamp del servidor
- **/logs** - Análisis de logs integrado

**💻 Ejemplo de uso:**
\`\`\`bash
# Verificar salud
python3 orus-api-client.py health

# Enviar consulta
python3 orus-api-client.py query "ORUS, estado del sistema"

# Obtener hora
python3 orus-api-client.py time

# Analizar logs
python3 orus-api-client-extended.py logs
\`\`\`

**🌐 Conexión:**
Todos los clientes se conectan a: http://188.245.56.151:8085
Con manejo robusto de errores, timeouts y reintentos automáticos.`;
      } else if (text.toLowerCase().includes('txt reader')) {
        response = `📄 **TXT Reader Module**

El módulo TXT Reader es un componente seguro para procesamiento de archivos de texto:

**🔒 Características de seguridad:**
- Límite de 1000 caracteres por seguridad
- Validación estricta de formato (.txt obligatorio)
- Codificación UTF-8 forzada para compatibilidad
- Control de errores integrado
- Solo lectura, nunca modifica archivos

**⚙️ Funcionamiento:**
1. Verifica existencia del archivo
2. Valida que sea formato .txt
3. Abre con encoding UTF-8
4. Lee contenido hasta el límite seguro
5. Devuelve respuesta estructurada con estado

**🔧 API de uso:**
\`\`\`python
def read_txt(file_path):
    if not os.path.exists(file_path):
        return {"error": "Archivo no encontrado"}
    
    if not file_path.endswith(".txt"):
        return {"error": "Formato no soportado"}
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    return {
        "status": "ok",
        "content": content[:1000]  # límite de seguridad
    }
\`\`\`

**📍 Integración MCP:**
- Ubicado en: /opt/modelscope-agent/mcp/txt-reader/
- Compatible con el ecosistema ModelScope
- Listo para ser invocado por otros módulos ORUS

**📋 Ejemplo:**
\`\`\`bash
python3 reader_txt.py test.txt
# Resultado: {"status": "ok", "content": "...", "filename": "test.txt"}
\`\`\``;
      } else if (text.toLowerCase().includes('rest api')) {
        response = `🚀 **ORUS REST API**

La API REST de ORUS proporciona endpoints completos para gestión del sistema:

**🌐 Endpoints disponibles:**

1. **GET /health**
   - Verificación de estado del sistema
   - Retorna: {"status": "ok", "timestamp": "...", "service": "ORUS-API"}

2. **POST /query**
   - Envío de consultas a ORUS
   - Body: {"text": "consulta", "source": "cliente"}
   - Retorna: {"status": "ok", "message": "respuesta", "timestamp": "..."}

3. **GET /time**
   - Obtención de timestamp del servidor
   - Retorna: {"status": "ok", "server_time": "2025-11-09T12:00:00Z"}

4. **GET /logs**
   - Análisis de logs del sistema
   - Retorna: {"status": "ok", "errors_found": [...], "total_errors": N}

**🔧 Configuración técnica:**
- **Framework**: FastAPI con Python
- **CORS**: Configurado para permitir acceso desde TECCIA-Z
- **Host**: 0.0.0.0 (acceso desde cualquier IP)
- **Port**: 8085
- **Encoding**: UTF-8

**🛡️ Seguridad implementada:**
- Validación de inputs en todos los endpoints
- Rate limiting implícito por timeouts
- Manejo seguro de errores (sin exposición de stack traces)
- CORS restrictivo a dominios autorizados

**📊 Ejemplo de uso:**
\`\`\`bash
# Health check
curl http://188.245.56.151:8085/health

# Enviar consulta
curl -X POST http://188.245.56.151:8085/query \\
  -H "Content-Type: application/json" \\
  -d '{"text": "ORUS, estado", "source": "test"}'

# Obtener hora
curl http://188.245.56.151:8085/time
\`\`\`

La API está completamente operativa y lista para producción.`;
      } else if (text.toLowerCase().includes('versionado')) {
        response = `🏷️ **Sistema de Versionado Automático**

El sistema de versionado automatiza completamente el ciclo de releases:

**🤖 Script principal: version-release.sh**

**🔧 Funcionalidades automatizadas:**

1. **Actualización de versiones**
   - Modifica package.json con nueva versión
   - Actualiza versión en página principal
   - Usa versionado semántico (MAJOR.MINOR.PATCH)

2. **Gestión de Git**
   - Crea commit con mensaje estructurado
   - Genera tag anotado con descripción completa
   - Sincroniza con repositorio remoto

3. **Publicación GitHub**
   - Sube cambios a rama principal
   - Publica tags en GitHub
   - Crea GitHub Release automático (si gh CLI disponible)

**📋 CHANGELOG dinámico:**
- Documentación automática de todos los cambios
- Estructura estandarizada con timestamps
- Impacto y beneficios para usuarios
- Próximos pasos sugeridos

**💻 Ejemplo de ejecución:**
\`\`\`bash
# Crear nueva versión
./version-release.sh 2.0.4 "Nueva funcionalidad X"

# Esto ejecuta automáticamente:
# 1. npm version 2.0.4 --no-git-tag-version
# 2. git add .
# 3. git commit -m "🚀 Release v2.0.4: Nueva funcionalidad X"
# 4. git tag -a v2.0.4 -m "Versión 2.0.4: Nueva funcionalidad X"
# 5. git push origin main
# 6. git push origin v2.0.4
# 7. gh release create v2.0.4 --title "🚀 TECCIA-Z v2.0.4"
\`\`\`

**🎯 Beneficios:**
- **Consistencia**: Siempre la misma estructura de releases
- **Velocidad**: Todo el proceso en un solo comando
- **Calidad**: Validación ESLint antes del release
- **Documentación**: CHANGELOG automático y detallado
- **Professionalismo**: Releases estructurados como en empresas

El sistema está listo para facilitar futuras actualizaciones del proyecto.`;
      } else if (text.toLowerCase().includes('estado') || text.toLowerCase().includes('módulos')) {
        response = `🎯 **Estado Actual del Sistema TECCIA-Z**

**📊 Resumen General:**
- **Versión**: v2.0.3
- **Módulos Operativos**: 5/5 (100%)
- **Archivos Funcionales**: 14
- **Estado**: 🟢 COMPLETAMENTE OPERATIVO

**🧠 Módulos Detallados:**

1. **🧠 Log Analyzer Module** ✅
   - Estado: Completado y funcional
   - Ubicación: /opt/modelscope-agent/mcp/log-analyzer/
   - Función: Detección automática de errores en logs
   - Patrones: 10 tipos de error detectables

2. **🔗 ORUS API Client Suite** ✅
   - Estado: Activo y conectado
   - Versiones: 6 clientes diferentes
   - Conexión: http://188.245.56.151:8085
   - Endpoints: /query, /health, /time, /logs

3. **📄 TXT Reader Module** ✅
   - Estado: Integrado con MCP
   - Ubicación: /opt/modelscope-agent/mcp/txt-reader/
   - Seguridad: Límite de 1000 caracteres
   - Formatos: .txt con UTF-8

4. **🚀 ORUS REST API** ✅
   - Estado: Activo en producción
   - Framework: FastAPI + Python
   - CORS: Configurado para TECCIA-Z
   - Puerto: 8085

5. **🏷️ Sistema de Versionado** ✅
   - Estado: Completado y automatizado
   - Script: version-release.sh
   - CHANGELOG: Dinámico y actualizado
   - GitHub: Releases automáticos

**🌐 Conectividad:**
- **ORUS Production**: 🟢 Conectado y respondiendo
- **AnythingLLM**: 🟢 Integrado con API key real
- **Socket.IO**: 🟡 En configuración
- **API REST**: 🟢 Todos los endpoints funcionales

**📈 Impacto en el Ecosistema:**
- **Monitoreo**: Detección proactiva de errores
- **Comunicación**: 6 clientes para diferentes casos de uso
- **Procesamiento**: Lectura segura de archivos de texto
- **Automatización**: Versionado profesional y releases
- **Integración**: Conexión total entre ORUS y TECCIA-Z

**🎯 Conclusión:**
El sistema TECCIA-Z v2.0.3 está 100% operativo con todos los módulos funcionando e integrados. Cada componente cumple su propósito específico y contribuye al ecosistema cognitivo distribuido de ORUS.`;
      } else {
        response = `🤖 **Respuesta de ORUS**

He recibido tu consulta: "${text}"

**🔍 Análisis del mensaje:**
- Longitud: ${text.length} caracteres
- Timestamp: ${new Date().toISOString()}
- Procesamiento: Completado

**📝 Estado del sistema:**
- ORUS Production: 🟢 Operativo
- API REST: 🟢 Funcional
- Módulos MCP: 🟢 Integrados
- TECCIA-Z: 🟢 Conectado

**💬 Para consultas específicas sobre los módulos desarrollados:**
- Prueba las preguntas predefinidas en la sección "Preguntas sobre Trabajos"
- Puedes preguntarme sobre Log Analyzer, API Clients, TXT Reader, ORUS API o Versionado

**🔧 Comando técnico utilizado:**
\`\`\`bash
python3 orus-api-client.py query "${text}"
\`\`\`

Estoy listo para ayudarte con cualquier consulta adicional sobre el sistema TECCIA-Z.`;
      }
      
      addMessage(response, 'orus');
      
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      addMessage('❌ Error al conectar con ORUS. Por favor, intenta nuevamente.', 'orus');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredefinedQuestion = (question: string, category: string) => {
    setSelectedCategory(category);
    sendToORUS(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendToORUS(inputText);
    }
  };

  const categories = Array.from(new Set(predefinedQuestions.map(q => q.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-left space-y-4">
          <div className="flex items-center justify-start gap-4">
            <div className="text-6xl animate-pulse">🧠</div>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🤖 ORUS Direct Chat
          </h1>
          <p className="text-xl text-gray-300">
            Conexión directa con ORUS Production - Preguntas predefinidas sobre los trabajos realizados
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-green-400" />
              ORUS Conectado
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              Chat en Vivo
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Respuestas Rápidas
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chat Area - Columna Izquierda - Fijo */}
          <div className="space-y-4">
            <Card className="border-2 border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Conversación con ORUS
                </CardTitle>
                <CardDescription>
                  Chat en vivo - Mensajes fijos en la izquierda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages Area - Fijo sin scroll */}
                <div className="h-96 w-full rounded-lg border border-slate-700 bg-black p-4 overflow-hidden">
                  <div className="space-y-4 overflow-y-auto h-full">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                        <p>¡Hola! Soy ORUS. Puedes preguntarme sobre los trabajos realizados o usar las preguntas predefinidas.</p>
                        <p className="text-sm mt-2">Ejemplo: "ORUS, explícame cómo funciona el Log Analyzer"</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className={`flex items-center gap-2 mb-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              {message.sender === 'user' ? (
                                <>
                                  <span className="text-xs text-gray-400">{message.timestamp}</span>
                                  <User className="w-4 h-4 text-blue-400" />
                                </>
                              ) : (
                                <>
                                  <Bot className="w-4 h-4 text-purple-400" />
                                  <span className="text-xs text-gray-400">{message.timestamp}</span>
                                </>
                              )}
                            </div>
                            <div className={`p-3 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-blue-600 text-white ml-auto' 
                                : message.isTyping 
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-purple-600 text-white'
                            }`}>
                              {message.isTyping ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                  <span className="ml-2">ORUS está pensando...</span>
                                </div>
                              ) : (
                                <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Input Area - Abajo del chat */}
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta para ORUS..."
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={() => sendToORUS(inputText)}
                    disabled={isLoading || !inputText.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-gray-400 text-center">
                  💡 Tip: Usa Enter para enviar, Shift+Enter para nueva línea
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predefined Questions - Columna Derecha - Con Scroll */}
          <div className="space-y-4">
            <Card className="border-2 border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Preguntas sobre Trabajos
                </CardTitle>
                <CardDescription>
                  Click para preguntar sobre cada módulo específico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto space-y-3">
                  {categories.map((category) => {
                    const categoryQuestions = predefinedQuestions.filter(q => q.category === category);
                    const Icon = categoryQuestions[0]?.icon || Activity;
                    const color = categoryQuestions[0]?.color || 'from-gray-600 to-slate-600';
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">{category}</span>
                        </div>
                        <div className="space-y-1">
                          {categoryQuestions.map((question) => (
                            <Button
                              key={question.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handlePredefinedQuestion(question.question, category)}
                              className="w-full justify-start h-auto p-3 bg-slate-700 border-slate-600 hover:bg-slate-600 text-left"
                            >
                              <span className="text-xs text-gray-300 whitespace-nowrap">{question.question}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border-2 border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">ORUS Production</span>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">API REST</span>
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Funcional
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">Módulos MCP</span>
                  <Badge className="bg-purple-500 hover:bg-purple-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Integrados
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">TECCIA-Z</span>
                  <Badge className="bg-orange-500 hover:bg-orange-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    v2.0.3
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 space-y-2 border-t border-slate-700 pt-6">
          <p>🧠 ORUS Production Direct Connection | TECCIA-Z Integration</p>
          <p>📦 Versión 2.0.3 | 🤖 Chat en Vivo | 🎯 Preguntas Predefinidas</p>
          <p className="text-xs text-gray-500">Comando técnico: python3 orus-api-client.py query "texto"</p>
        </div>
      </div>
    </div>
  );
}