import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Server, Bot, ArrowRight, Shield, Lock, Database, Code, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl sm:text-4xl font-bold text-white">🧠</span>
            </div>
            <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🧠 TECCIA-Z Control Center
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300">
            Panel de control del ecosistema cognitivo distribuido ORUS
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Trabajos Realizados - Restaurar tarjeta */}
          <Card className="border-2 border-purple-100 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                <span className="hidden xs:inline sm:inline">Trabajos Realizados</span>
                <span className="xs:hidden">Trabajos</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Visualiza todos los módulos desarrollados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-xs sm:text-sm">5 Módulos Listos</div>
                  <div className="text-xs text-xs sm:text-xs text-muted-foreground">100% Funcional</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/trabajos-realizados">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base">
                    <Code className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Ver Trabajos</span>
                    <span className="sm:hidden">Ver</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ORUS Direct Connection */}
          <Card className="border-2 border-blue-100 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <span className="hidden xs:inline sm:inline">ORUS Direct Chat</span>
                <span className="xs:hidden">Chat ORUS</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Conexión directa para chatear con ORUS Production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-xs sm:text-sm">Chat en Vivo</div>
                  <div className="text-xs text-xs sm:text-xs text-muted-foreground">Conexión real</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/orus-direct-chat">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base">
                    <Brain className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Chatear con ORUS</span>
                    <span className="sm:hidden">Chat</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AnythingLLM Test */}
          <Card className="border-2 border-green-100 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                <Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                <span className="hidden xs:inline sm:inline">AnythingLLM Test</span>
                <span className="xs:hidden">AnythingLLM</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Conexión real con AnythingLLM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                <div>
                  <div className="font-medium text-xs sm:text-sm">API Key Real</div>
                  <div className="text-xs text-xs sm:text-xs text-muted-foreground hidden xs:block">HHNP18V-MRK4BT0...</div>
                  <div className="text-xs text-xs sm:text-xs text-muted-foreground xs:hidden">API Key</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/anythingllm-test">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-sm sm:text-base">
                    <Database className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Test AnythingLLM</span>
                    <span className="sm:hidden">Test</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Production Version */}
          <Card className="border-2 border-red-100 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                <span className="hidden xs:inline sm:inline">ORUS Production</span>
                <span className="xs:hidden">Production</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Conexión real con ORUS production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg">
                <Server className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                <div>
                  <div className="font-medium text-xs sm:text-sm">Conexión Real</div>
                  <div className="text-xs text-xs sm:text-xs text-muted-foreground hidden xs:block">ORUS production</div>
                  <div className="text-xs text-xs sm:text-xs text-muted-foreground xs:hidden">Production</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/orus-production">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-sm sm:text-base">
                    <Shield className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">ORUS Production</span>
                    <span className="sm:hidden">ORUS</span>
                    <Lock className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs sm:text-sm text-gray-400 space-y-2 border-t border-slate-700 pt-4 sm:pt-6">
          <p className="hidden xs:block">🧠 TECCIA-Z Development Team | ORUS ModelScope Agent Integration | 🎯 Chat ORUS 2 Columnas</p>
          <p className="xs:hidden">🧠 TECCIA-Z | ORUS Integration | 🎯 Chat ORUS 2 Columnas</p>
          <p>📦 Versión 2.0.4 | 🚀 5 Módulos Operativos | 🔧 14 Archivos Funcionales | 🎯 Chat ORUS 2 Columnas</p>
          <p className="hidden xs:block">Panel de Trabajos Realizados - Sistema de Gestión de Proyectos</p>
          <p className="xs:hidden">Trabajos - Gestión de Proyectos</p>
        </div>
      </div>
    </div>
  );
}