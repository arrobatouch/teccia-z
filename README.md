# 🧠 TECCIA-Z - ORUS Control Center

> Panel de control visual del ecosistema cognitivo distribuido ORUS

## 🌟 Descripción

TECCIA-Z es un panel de control futurista para interactuar con ORUS, el agente cognitivo maestro del ecosistema OIKO. Este proyecto proporciona una interfaz visual espectacular para:

- 🧠 Conectar y monitorear ORUS (Agente Cognitivo Maestro)
- 🔧 Descubrir contenedores Modelscope especializados
- 📚 Interactuar con AnythingLLM (Memoria Central)
- 💬 Chat directo con el agente cognitivo
- 📟 Terminal de logs en tiempo real

## 🚀 Tecnologías

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui (New York style)
- **Backend**: Node.js + API Routes
- **Styling**: Tailwind CSS con gradientes neón
- **Icons**: Lucide React
- **Animations**: CSS animations + Tailwind

## 🎨 Características Visuales

- 🌈 Gradientes brillantes (azul → púrpura → rosa)
- 🧠 Logo animado con efectos de pulso
- 💫 Efectos glassmorphism en tarjetas
- 📟 Terminal estilo Matrix con texto verde
- ⚡ Animaciones suaves y transiciones fluidas
- 🌙 Tema oscuro futurista

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx                 # Página principal
│   ├── orus-connection/
│   │   └── page.tsx            # Panel de control ORUS
│   ├── layout.tsx              # Layout principal
│   ├── globals.css             # Estilos globales
│   └── api/
│       └── orus/
│           └── route.ts        # API endpoint para ORUS
├── components/
│   └── ui/                     # Componentes shadcn/ui
└── lib/
    └── utils.ts                # Utilidades
```

## 🎮 Uso

### 1. Instalación
```bash
npm install
```

### 2. Desarrollo
```bash
npm run dev
```

### 3. Producción
```bash
npm run build
npm start
```

## 🔧 Funcionalidades

### 🧠 Panel Principal
- Descubrimiento automático del ecosistema ORUS
- Monitoreo de contenedores Modelscope
- Estado del sistema en tiempo real
- Indicadores visuales animados

### 💬 Chat con ORUS
- Consultas directas al agente cognitivo
- Respuestas en formato JSON estructurado
- Historial de conversaciones
- Métricas de respuesta y confianza

### 📟 Terminal de Logs
- Logs en tiempo real de todas las operaciones
- Estilo hacker con texto verde
- Scroll automático y timestamps

## 🌐 Endpoints

- **Principal**: `http://localhost:3000`
- **Panel ORUS**: `http://localhost:3000/orus-connection`
- **API ORUS**: `http://localhost:3000/api/orus`

## 📊 Métricas del Sistema

- 🤖 Estado de ORUS Principal
- 🔧 Contenedores activos
- ⚡ Estado general del sistema
- 💬 Consultas realizadas

## 🎯 Demostración

El proyecto incluye un modo demostración con:
- 3 contenedores simulados (voice, vision, reasoning)
- Respuestas automáticas a consultas
- Logs animados del proceso
- Estados visuales predefinidos

## 🎨 Estilos Personalizados

El proyecto incluye clases CSS personalizadas para:

- `.glass-morphism` - Efecto de cristal esmerilado
- `.neon-glow` - Efecto de neón brillante
- `.neon-text` - Texto con brillo neón
- `.terminal-text` - Estilo de terminal Matrix
- `.pulse-glow` - Animación de pulso con brillo
- `.float-animation` - Animación de flotación

## 🤝 Contribución

Este proyecto es parte del ecosistema TECCIA-OIKO:

1. Fork del repositorio
2. Crear rama `feature/tu-funcionalidad`
3. Commit con cambios descriptivos
4. Push a la rama
5. Pull Request

## 📄 Licencia

© 2025 TECCIA S.R.L. - Todos los derechos reservados.

## 🙏 Agradecimientos

- **ORUS Team** - Por el agente cognitivo maestro
- **Modelscope** - Por el framework de IA multimodal
- **AnythingLLM** - Por la memoria semántica
- **shadcn/ui** - Por los componentes increíbles

---

🧠 **TECCIA-Z - Donde la IA cobra vida visual** 🚀