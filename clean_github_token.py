#!/usr/bin/env python3

# Reemplazar el token en el archivo github_connector.py
with open('/home/z/my-project/opt/modelscope-agent/connectors/github_connector.py', 'r') as f:
    content = f.read()

# Reemplazar todas las líneas que contienen el token
content_clean = content.replace(
    'self.github_token = os.getenv("GITHUB_TOKEN", ""),
    'self.github_user = os.getenv("GITHUB_USER", "arrobatouch"),
    'self.github_repo = os.getenv("GITHUB_REPO", "teccia-z")
)

# Escribir el archivo limpio
with open('/home/z/my-project/opt/modelscope-agent/connectors/github_connector.py', 'w') as f:
    f.write(content_clean)

print('✅ Token limpiado de github_connector.py')