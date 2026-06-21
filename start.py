import os
import sys
import time
import webbrowser
import subprocess

def main():
    print("=" * 60)
    print("              VIBECRAFT STUDIO STARTUP RUNNER               ")
    print("=" * 60)
    
    # 1. Check dependencies
    print("[*] Checking file structure...")
    files = ["backend.py", "mcp_server.py", "code.html"]
    missing = [f for f in files if not os.path.exists(f)]
    if missing:
        print(f"[!] Error: Missing required files: {missing}")
        sys.exit(1)
    print("[+] File structure verified.")

    # 2. Check for sandbox placeholder
    sandbox_dir = "sandbox"
    os.makedirs(sandbox_dir, exist_ok=True)
    placeholder = os.path.join(sandbox_dir, "index.html")
    if not os.path.exists(placeholder):
        print("[*] Creating default sandbox placeholder...")
        with open(placeholder, "w") as f:
            f.write("<h1>VibeCraft Sandbox</h1><p>No component generated yet.</p>")
            
    # 3. Check for .env file containing GEMINI_API_KEY
    if not os.path.exists(".env"):
        print("[!] Warning: .env file not found. Ensure GEMINI_API_KEY is defined in your environment.")
    else:
        print("[+] .env file detected.")

    # 4. Open browser after a short delay
    print("[*] Starting backend server on http://localhost:8000 ...")
    
    # We will launch uvicorn as a subprocess or just run backend.py directly
    try:
        # Schedule browser open in 2 seconds
        def open_browser():
            time.sleep(2.0)
            print("[+] Opening web browser to http://localhost:8000 ...")
            webbrowser.open("http://localhost:8000")
            
        import threading
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Run backend.py which starts uvicorn
        cmd = [sys.executable, "backend.py"]
        subprocess.run(cmd)
        
    except KeyboardInterrupt:
        print("\n[+] VibeCraft Studio stopped.")
    except Exception as e:
        print(f"[!] Error running server: {e}")

if __name__ == "__main__":
    main()
