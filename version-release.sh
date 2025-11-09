#!/bin/bash
# 🚀 TECCIA-Z Automatic Version Release Script
# Uso: ./version-release.sh [version] [description]

set -e  # Detener si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Header
echo -e "${CYAN}🚀 TECCIA-Z Automatic Version Release Script${NC}"
echo -e "${CYAN}================================================${NC}"

# Parámetros
VERSION=${1:-"2.0.3"}
DESCRIPTION=${2:-"Panel de Trabajos Realizados + Versionado Automático"}

echo -e "${BLUE}📦 Versión:${NC} ${YELLOW}$VERSION${NC}"
echo -e "${BLUE}📝 Descripción:${NC} ${YELLOW}$DESCRIPTION${NC}"
echo ""

# Verificar si estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "Oiko" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${RED}❌ Error: Debes estar en la rama 'main', 'Oiko' o 'master'${NC}"
    echo -e "${RED}   Rama actual: $CURRENT_BRANCH${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Rama verificada: $CURRENT_BRANCH${NC}"

# Verificar si hay cambios pendientes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Hay cambios pendientes. Se harán commit automáticamente.${NC}"
    HAS_CHANGES=true
else
    echo -e "${GREEN}✅ No hay cambios pendientes${NC}"
    HAS_CHANGES=false
fi

# 1. Actualizar versión en package.json
echo -e "${BLUE}📋 Actualizando versión en package.json...${NC}"
npm version $VERSION --no-git-tag-version --allow-same-version
echo -e "${GREEN}✅ package.json actualizado${NC}"

# 2. Actualizar versión en página principal
echo -e "${BLUE}📋 Actualizando versión en página principal...${NC}"
sed -i "s/🏷️ Version: v[0-9]\+\.[0-9]\+\.[0-9]\+/🏷️ Version: v$VERSION/" src/app/page.tsx
echo -e "${GREEN}✅ Página principal actualizada${NC}"

# 3. Verificar calidad del código
echo -e "${BLUE}🔍 Verificando calidad del código...${NC}"
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Código verificado (ESLint OK)${NC}"
else
    echo -e "${RED}❌ Error de ESLint. Corrige antes de continuar.${NC}"
    exit 1
fi

# 4. Agregar archivos al commit
echo -e "${BLUE}📝 Preparando commit...${NC}"
git add .
echo -e "${GREEN}✅ Archivos agregados${NC}"

# 5. Crear commit
if [ "$HAS_CHANGES" = true ] || [ "$VERSION" != "2.0.3" ]; then
    COMMIT_MESSAGE="🚀 Release v$VERSION: $DESCRIPTION"
    echo -e "${BLUE}💾 Creando commit...${NC}"
    git commit -m "$COMMIT_MESSAGE"
    echo -e "${GREEN}✅ Commit creado: $COMMIT_MESSAGE${NC}"
else
    echo -e "${YELLOW}⚠️  No hay cambios nuevos para commitear${NC}"
fi

# 6. Crear tag
echo -e "${BLUE}🏷️  Creando tag v$VERSION...${NC}"
TAG_MESSAGE="Versión $VERSION: $DESCRIPTION

🚀 TECCIA-Z v$VERSION

📋 Cambios principales:
• Panel de Trabajos Realizados
• Sistema de Versionado Automático
• 4 Módulos completamente funcionales
• Integración con GitHub Releases

🌐 Acceso: http://localhost:3000/trabajos-realizados

🏆 TECCIA-Z - Ecosistema ORUS Integration"

git tag -a v$VERSION -m "$TAG_MESSAGE"
echo -e "${GREEN}✅ Tag v$VERSION creado${NC}"

# 7. Push al repositorio remoto
echo -e "${BLUE}📤 Subiendo cambios a GitHub...${NC}"
git push origin $CURRENT_BRANCH
echo -e "${GREEN}✅ Cambios subidos a rama $CURRENT_BRANCH${NC}"

# 8. Push del tag
echo -e "${BLUE}🏷️  Subiendo tag a GitHub...${NC}"
git push origin v$VERSION
echo -e "${GREEN}✅ Tag v$VERSION subido${NC}"

# 9. Crear GitHub Release (usando gh CLI si está disponible)
if command -v gh &> /dev/null; then
    echo -e "${BLUE}🌐 Creando GitHub Release...${NC}"
    gh release create v$VERSION \
        --title "🚀 TECCIA-Z v$VERSION" \
        --notes "$TAG_MESSAGE" \
        --target $CURRENT_BRANCH
    echo -e "${GREEN}✅ GitHub Release creado${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub CLI no encontrado. Crea el release manualmente:${NC}"
    echo -e "${YELLOW}   https://github.com/arrobatouch/teccia-z/releases/new${NC}"
fi

# 10. Resumen final
echo ""
echo -e "${CYAN}🎉 RELEASE COMPLETADO${NC}"
echo -e "${CYAN}==================${NC}"
echo -e "${GREEN}✅ Versión:${NC} ${YELLOW}$VERSION${NC}"
echo -e "${GREEN}✅ Tag:${NC} ${YELLOW}v$VERSION${NC}"
echo -e "${GREEN}✅ Rama:${NC} ${YELLOW}$CURRENT_BRANCH${NC}"
echo -e "${GREEN}✅ GitHub:${NC} ${YELLOW}https://github.com/arrobatouch/teccia-z/releases/tag/v$VERSION${NC}"
echo ""
echo -e "${PURPLE}🚀 TECCIA-Z v$VERSION está listo para producción!${NC}"
echo -e "${PURPLE}🌐 Acceso al nuevo panel: http://localhost:3000/trabajos-realizados${NC}"
echo ""

# 11. Información de ORUS
echo -e "${BLUE}🧠 INTEGRACIÓN CON ORUS:${NC}"
echo -e "${GREEN}✅ Log Analyzer:${NC} /opt/modelscope-agent/mcp/log-analyzer/"
echo -e "${GREEN}✅ API Clients:${NC} 6 versiones disponibles"
echo -e "${GREEN}✅ TXT Reader:${NC} /opt/modelscope-agent/mcp/txt-reader/"
echo -e "${GREEN}✅ ORUS API:${NC} http://188.245.56.151:8085"
echo ""

echo -e "${CYAN}🏆 ¡TRABAJO COMPLETADO CON ÉXITO! 🏆${NC}"