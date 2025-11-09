import os

def read_txt(file_path):
    """Lee archivos de texto plano (.txt) y devuelve su contenido."""
    if not os.path.exists(file_path):
        return {"error": "Archivo no encontrado"}

    if not file_path.endswith(".txt"):
        return {"error": "Formato no soportado. Solo .txt"}

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    return {
        "status": "ok",
        "filename": os.path.basename(file_path),
        "content": content[:1000]  # solo primeros 1000 caracteres por seguridad
    }

if __name__ == "__main__":
    print(read_txt("test.txt"))