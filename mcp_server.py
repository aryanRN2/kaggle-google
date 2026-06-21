import os
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("VibeCraft")

SANDBOX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sandbox"))

def secure_path(path: str) -> str:
    """Ensures the path is resolved safely inside the sandbox folder."""
    workspace_root = "/Users/aryanmaurya/kaggle hackathon"
    
    # Standardize slash separators and remove leading slash
    clean_path = path.replace("\\", "/")
    
    # Extract relative path if absolute or relative workspace prefix is supplied
    if clean_path.startswith(workspace_root):
        clean_path = os.path.relpath(clean_path, workspace_root)
    elif clean_path.startswith(workspace_root.lstrip("/")):
        clean_path = os.path.relpath(clean_path, workspace_root.lstrip("/"))
    elif clean_path.startswith("sandbox/"):
        clean_path = clean_path[len("sandbox/"):]
        
    clean_path = clean_path.lstrip("/")
    
    full_path = os.path.abspath(os.path.join(SANDBOX_DIR, clean_path))
    if not full_path.startswith(SANDBOX_DIR):
        raise ValueError(f"Path traversal detected: {path} resolves outside sandbox.")
        
    return full_path

@mcp.tool()
def write_file(filename: str, content: str = "") -> str:
    """Writes the given text content to a file in the sandbox directory.
    
    Args:
        filename: Relative path to the file inside the sandbox, e.g. "index.html" or "js/app.js".
        content: The text contents of the file.
    """
    try:
        if content is None:
            content = ""
        target_path = secure_path(filename)
        # Ensure parent directory exists
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote {len(content)} characters to {filename}."
    except Exception as e:
        return f"Error writing file: {str(e)}"

@mcp.tool()
def read_file(filename: str) -> str:
    """Reads the content of a file in the sandbox directory.
    
    Args:
        filename: Relative path to the file inside the sandbox, e.g. "index.html".
    """
    try:
        target_path = secure_path(filename)
        if not os.path.exists(target_path):
            return f"Error: File {filename} does not exist."
        with open(target_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

@mcp.tool()
def list_files() -> str:
    """Lists all files in the sandbox directory recursively, returning a relative path index."""
    try:
        if not os.path.exists(SANDBOX_DIR):
            return "Sandbox folder is empty."
        
        file_list = []
        for root, _, files in os.walk(SANDBOX_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, SANDBOX_DIR)
                file_list.append(rel_path)
                
        if not file_list:
            return "Sandbox folder is empty."
            
        return "\n".join(file_list)
    except Exception as e:
        return f"Error listing files: {str(e)}"

if __name__ == "__main__":
    mcp.run()
