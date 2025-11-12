'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Server, 
  FileText, 
  Terminal, 
  Code, 
  CheckCircle, 
  Activity,
  Zap,
  Database,
  Shield,
  Globe,
  Cpu,
  ArrowRight,
  Play,
  Settings,
  GitBranch,
  Rocket
} from "lucide-react";
import Link from "next/link";

interface Modulo {
  id: string;
  titulo: string;
  descripcion: string;
  icono: any;
  color: string;
  estado: 'completado' | 'activo' | 'integrado';
  ruta: string;
}

const modulos: Modulo[] = [
  {
    id: 'modulos',
    titulo: '🎯 Módulos Desarrollados',
    descripcion: 'Visualización completa de todos los trabajos y sistemas implementados en el ecosistema',
    icono: Code,
    color: 'from-purple-600 to-pink-600',
    estado: 'completado',
    ruta: '/trabajos-realizados'
  },
  {
    id: 'anythingllm',
    titulo: '📚 AnythingLLM',
    descripcion: 'Sistema de memoria y base de conocimientos con AnythingLLM para gestión documental',
    icono: Database,
    color: 'from-green-600 to-emerald-600',
    estado: 'integrado',
    ruta: '/anythingllm-test'
  },
  {
    id: 'production',
    titulo: '🔴 Sistema en Producción',
    descripcion: 'Monitoreo y control del sistema ORUS en entorno productivo',
    icono: Server,
    color: 'from-red-600 to-orange-600',
    estado: 'activo',
    ruta: '/orus-production'
  }
];

export default function Home() {
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
            <div className="text-6xl animate-pulse">🚀</div>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🧠 TECCIA-Z CONTROL CENTER
          </h1>
          <p className="text-xl text-gray-300">
            Sistema de gestión y monitoreo del ecosistema cognitivo ORUS
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              3 Módulos Principales
            </span>
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              100% Operativo
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Sistema Seguro
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modulos.map((modulo) => {
            const Icon = modulo.icono;
            return (
              <Card 
                key={modulo.id} 
                className="border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 transition-all cursor-pointer group"
              >
                <Link href={modulo.ruta}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${modulo.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {getEstadoBadge(modulo.estado)}
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                      {modulo.titulo}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {modulo.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-slate-700">
                        <Play className="w-4 h-4 mr-2" />
                        Acceder Módulo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* System Status */}
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
                <div className="text-sm text-gray-400">Módulos Principales</div>
                <div className="text-lg font-bold text-purple-400">3</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <div className="text-sm text-gray-400">Estado</div>
                <div className="text-lg font-bold text-yellow-400">OPERATIVO</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <div className="text-sm text-gray-400">Versión</div>
                <div className="text-lg font-bold text-blue-400">v2.0.8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🧠 ORUS - Agente Cognitivo Multimodal | Arquitectura Distribuida</p>
          <p>🔧 Modelscope - Contenedores Especializados | 📚 AnythingLLM - Memoria Central</p>
          <p className="text-xs text-gray-500">TECCIA-Z Control Center v2.0.8 - Sistema Operativo</p>
        </div>
      </div>
    </div>
  );
}