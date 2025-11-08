import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Server, Bot, ArrowRight, Shield, Lock, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl font-bold text-white">🧠</span>
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🧠 TECCIA-Z Control Center
          </h1>
          <p className="text-2xl text-gray-300">
            Panel de control del ecosistema cognitivo distribuido ORUS
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Demo Version */}
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                Versión Demo
              </CardTitle>
              <CardDescription>
                Explora el panel con datos simulados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Server className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Demo Interactiva</div>
                  <div className="text-xs text-muted-foreground">Datos simulados</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/orus-connection">
                  <Button className="w-full" variant="outline">
                    <Brain className="mr-2 h-4 w-4" />
                    Probar Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AnythingLLM Test */}
          <Card className="border-2 border-green-100 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-green-600" />
                AnythingLLM Test
              </CardTitle>
              <CardDescription>
                Conexión real con AnythingLLM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Lock className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium text-sm">API Key Real</div>
                  <div className="text-xs text-muted-foreground">HHNP18V-MRK4BT0...</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/anythingllm-test">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Database className="mr-2 h-4 w-4" />
                    Test AnythingLLM
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Production Version */}
          <Card className="border-2 border-red-100 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                ORUS Production
              </CardTitle>
              <CardDescription>
                Conexión real con ORUS production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <Server className="h-6 w-6 text-red-600" />
                <div>
                  <div className="font-medium text-sm">Conexión Real</div>
                  <div className="text-xs text-muted-foreground">ORUS production</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/orus-production">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                    <Shield className="mr-2 h-4 w-4" />
                    ORUS Production
                    <Lock className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-400 space-y-2">
          <div className="flex items-center justify-center gap-4">
            <span>🧠 ORUS - Agente Cognitivo Multimodal</span>
            <span>🔧 Modelscope - Contenedores Especializados</span>
            <span>📚 AnythingLLM - Memoria Central</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span>📦 GitHub: teccia-z</span>
            <span>🌿 Branch: Oiko</span>
            <span>🏷️ Version: v1.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}