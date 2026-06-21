import os
import json
import asyncio
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import StreamingResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import dotenv
from google.antigravity import Agent, LocalAgentConfig, types
from google.antigravity.hooks import policy, hooks

# Load environment variables (contains GEMINI_API_KEY)
dotenv.load_dotenv()

app = FastAPI(title="VibeCraft Backend")

# Ensure sandbox directory exists
SANDBOX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sandbox"))
os.makedirs(SANDBOX_DIR, exist_ok=True)

# Mount sandbox directory as static files to allow iframe rendering
app.mount("/sandbox", StaticFiles(directory=SANDBOX_DIR), name="sandbox")

@app.get("/", response_class=FileResponse)
async def read_index():
    """Serves the main dashboard UI."""
    return FileResponse("code.html")

@app.get("/api/files")
async def get_files():
    """Returns a list of all files in the sandbox folder recursively."""
    try:
        file_list = []
        for root, _, files in os.walk(SANDBOX_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, SANDBOX_DIR)
                file_list.append(rel_path)
        return {"files": sorted(file_list)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files/read")
async def read_file(filename: str = Query(..., description="Relative path of file inside sandbox")):
    """Reads the contents of a file inside the sandbox folder."""
    clean_path = filename.lstrip("/")
    target_path = os.path.abspath(os.path.join(SANDBOX_DIR, clean_path))
    
    if not target_path.startswith(SANDBOX_DIR):
        raise HTTPException(status_code=400, detail="Path traversal detected.")
        
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="File not found.")
        
    try:
        with open(target_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"filename": filename, "content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/files/delete")
async def delete_file(filename: str = Query(..., description="Relative path of file inside sandbox")):
    """Deletes a file or directory inside the sandbox folder."""
    clean_path = filename.lstrip("/")
    target_path = os.path.abspath(os.path.join(SANDBOX_DIR, clean_path))
    
    if not target_path.startswith(SANDBOX_DIR):
        raise HTTPException(status_code=400, detail="Path traversal detected.")
        
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="File not found.")
        
    try:
        if os.path.isdir(target_path):
            import shutil
            shutil.rmtree(target_path)
        else:
            os.remove(target_path)
        return {"filename": filename, "status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat")
async def chat_stream(prompt: str = Query(..., description="Prompt to send to the builder agent")):
    """Streams the agent's thoughts, tool calls, and final response tokens via Server-Sent Events (SSE)."""
    
    async def sse_generator():
        queue = asyncio.Queue()

        # Hooks to intercept tool execution and pipe to queue
        @hooks.pre_tool_call_decide
        async def pre_tool(data: types.ToolCall) -> types.HookResult:
            await queue.put(("tool_start", data.name))
            return types.HookResult(allow=True)

        @hooks.post_tool_call
        async def post_tool(data):
            # Resolve tool completion message
            await queue.put(("tool_end", "completed"))

        async def run_agent():
            try:
                # Specify the local Stdio MCP server
                mcp_servers = [
                    types.McpStdioServer(
                        name="VibeCraft",
                        command="python3",
                        args=["mcp_server.py"],
                    )
                ]
                
                CONVO_ID_FILE = os.path.join(os.path.dirname(__file__), "conversation_id.txt")
                SAVE_DIR = os.path.join(os.path.dirname(__file__), "conversation_history")
                os.makedirs(SAVE_DIR, exist_ok=True)
                
                convo_id = None
                if os.path.exists(CONVO_ID_FILE):
                    with open(CONVO_ID_FILE, "r") as f:
                        convo_id = f.read().strip()
                        if not convo_id:
                            convo_id = None

                # Configuration for VibeCraft Architect Agent
                config = LocalAgentConfig(
                    model="gemini-2.5-flash",
                    conversation_id=convo_id,
                    save_dir=SAVE_DIR,
                    mcp_servers=mcp_servers,
                    system_instructions=(
                        "You are VibeAgent, the elite autonomous software engineer in the VibeCraft Studio. "
                        "Your task is to build web applications (HTML, CSS, JS) in the sandbox directory. "
                        "You MUST use the write_file tool to create/edit files. Always write full, functional "
                        "code with beautiful corporate-modern design (clean layouts, pastel/slate colors, proper spacing). "
                        "For CSS, use vanilla CSS in a stylesheet or CDN TailwindCSS. "
                        "When done, let the user know what you created and how to use it. "
                        "DO NOT write mock placeholders; write complete working applications."
                    ),
                    policies=[
                        policy.confirm_run_command(), # Denies run_command
                        policy.allow("mcp(VibeCraft/*)"), # Allow our custom filesystem tools
                    ],
                    hooks=[pre_tool, post_tool]
                )
                
                async with Agent(config) as agent:
                    await queue.put(("status", "Agent initialized..."))
                    response = await agent.chat(prompt)
                    
                    if not convo_id and agent.conversation_id:
                        with open(CONVO_ID_FILE, "w") as f:
                            f.write(agent.conversation_id)
                    
                    # 1. Stream thinking process (thoughts)
                    await queue.put(("status", "Thinking..."))
                    async for thought in response.thoughts:
                        await queue.put(("thought", thought))
                        
                    # 2. Stream final text tokens
                    await queue.put(("status", "Responding..."))
                    async for token in response:
                        await queue.put(("token", token))
                        
                await queue.put(("done", None))
            except Exception as e:
                await queue.put(("error", str(e)))

        # Launch the agent turn task in the background
        agent_task = asyncio.create_task(run_agent())
        
        try:
            while True:
                event_type, data = await queue.get()
                if event_type == "done":
                    yield "event: done\ndata: {}\n\n"
                    break
                elif event_type == "error":
                    yield f"event: error\ndata: {json.dumps(data)}\n\n"
                    break
                elif event_type == "status":
                    yield f"event: status\ndata: {json.dumps(data)}\n\n"
                elif event_type == "thought":
                    yield f"event: thought\ndata: {json.dumps(data)}\n\n"
                elif event_type == "token":
                    yield f"event: token\ndata: {json.dumps(data)}\n\n"
                elif event_type == "tool_start":
                    yield f"event: tool_start\ndata: {json.dumps(data)}\n\n"
                elif event_type == "tool_end":
                    yield f"event: tool_end\ndata: {json.dumps(data)}\n\n"
        except asyncio.CancelledError:
            agent_task.cancel()
            raise
            
    return StreamingResponse(sse_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
