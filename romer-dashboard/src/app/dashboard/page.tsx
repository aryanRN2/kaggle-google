"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { 
  FolderOpen,
  FileCode,
  RotateCw,
  Cpu,
  Trash2
} from "lucide-react";

function DashboardContent() {
  // VibeAgent Workspace state
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; isThought?: boolean }>>([]);
  const [agentStatus, setAgentStatus] = useState("Idle");
  const [sandboxFiles, setSandboxFiles] = useState<string[]>([]);
  const [activeCodeFile, setActiveCodeFile] = useState<string | null>(null);
  const [activeCodeContent, setActiveCodeContent] = useState("");
  const [rightPaneTab, setRightPaneTab] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentStatus]);

  // Fetch sandbox files
  const refreshFilesList = useCallback(async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (data.files) {
        setSandboxFiles(data.files);
        if (data.files.length > 0 && !activeCodeFile) {
          // Default to index.html if present, else first file
          if (data.files.includes("index.html")) {
            setActiveCodeFile("index.html");
          } else {
            setActiveCodeFile(data.files[0]);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  }, [activeCodeFile]);

  // Load sandbox files on mount
  useEffect(() => {
    refreshFilesList();
  }, [refreshFilesList]);

  // Fetch active file content
  useEffect(() => {
    const fetchContent = async () => {
      if (!activeCodeFile) return;
      try {
        const res = await fetch(`/api/files/read?filename=${encodeURIComponent(activeCodeFile)}`);
        const data = await res.json();
        if (data.content !== undefined) {
          setActiveCodeContent(data.content);
        }
      } catch (err) {
        console.error("Error reading file content:", err);
      }
    };
    fetchContent();
  }, [activeCodeFile]);

  // Submit Prompt to Agent
  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;
    const text = prompt;
    setPrompt("");

    // Add user prompt to chat
    setMessages((prev) => [...prev, { sender: "You", text }]);
    setAgentStatus("Thinking...");

    let currentThoughtText = "";
    let currentResponseText = "";

    // Connect to SSE stream
    const eventSource = new EventSource(`/api/chat?prompt=${encodeURIComponent(text)}`);

    eventSource.addEventListener("status", (e) => {
      try {
        const statusMsg = JSON.parse(e.data);
        setAgentStatus(statusMsg);
      } catch {}
    });

    eventSource.addEventListener("thought", (e) => {
      try {
        const chunk = JSON.parse(e.data);
        currentThoughtText += chunk;
        setAgentStatus("Thinking...");
        setMessages((prev) => {
          const next = [...prev];
          const lastMsg = next[next.length - 1];
          if (lastMsg && lastMsg.sender === "VibeAgent" && lastMsg.isThought) {
            lastMsg.text = currentThoughtText;
            return next;
          } else {
            return [...next, { sender: "VibeAgent", text: currentThoughtText, isThought: true }];
          }
        });
      } catch {}
    });

    eventSource.addEventListener("token", (e) => {
      try {
        const chunk = JSON.parse(e.data);
        currentResponseText += chunk;
        setAgentStatus("Responding...");
        setMessages((prev) => {
          const next = [...prev];
          const lastMsg = next[next.length - 1];
          if (lastMsg && lastMsg.sender === "VibeAgent" && !lastMsg.isThought) {
            lastMsg.text = currentResponseText;
            return next;
          } else {
            // Insert after thought
            return [...next, { sender: "VibeAgent", text: currentResponseText, isThought: false }];
          }
        });
      } catch {}
    });

    eventSource.addEventListener("tool_start", (e) => {
      try {
        const toolName = JSON.parse(e.data);
        setAgentStatus(`Running tool: ${toolName}...`);
      } catch {}
    });

    eventSource.addEventListener("tool_end", () => {
      refreshFilesList();
      setPreviewKey((prev) => prev + 1);
    });

    eventSource.addEventListener("done", () => {
      eventSource.close();
      setAgentStatus("Idle");
      refreshFilesList();
      setPreviewKey((prev) => prev + 1);
    });

    eventSource.addEventListener("error", (e) => {
      eventSource.close();
      setAgentStatus("Idle");
      const msgEvent = e as MessageEvent;
      const errData = msgEvent && msgEvent.data ? JSON.parse(msgEvent.data) : "EventSource disconnected.";
      setMessages((prev) => [...prev, { sender: "System", text: `Connection error: ${errData}` }]);
      refreshFilesList();
      setPreviewKey((prev) => prev + 1);
    });
  };

  const handleDeleteFile = async (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
    
    try {
      const res = await fetch(`/api/files/delete?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.status === "deleted") {
        if (activeCodeFile === filename) {
          setActiveCodeFile(null);
          setActiveCodeContent("");
        }
        refreshFilesList();
      } else {
        alert(`Error deleting file: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete file.");
    }
  };

  const renderFormattedText = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : "";
        const code = match ? match[2] : part.slice(3, -3);
        return (
          <div key={index} className="my-3 border border-[#1b1c1e] rounded bg-[#0a0a0b] overflow-hidden">
            <div className="bg-[#121213] border-b border-[#1B1C1E] px-3 py-1 flex justify-between items-center select-none">
              <span className="text-[9px] text-[#666] font-mono uppercase font-semibold tracking-wider">
                {language || "code"}
              </span>
            </div>
            <pre className="p-3 overflow-auto text-[10px] font-mono text-[#a0a0a0] leading-relaxed whitespace-pre scrollbar-thin">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden antialiased font-sans text-sm bg-[#000000] text-[#e5e2e3]">
      
      {/* Left Pane - Working Directory Explorer */}
      <aside className="w-60 bg-[#0e0e0f] border-r border-[#1B1C1E] flex flex-col h-full shrink-0 select-none">
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-[#1B1C1E] flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#ffffff] text-[#000000] flex items-center justify-center font-bold font-mono text-xs">
            C
          </div>
          <div>
            <h2 className="font-manrope text-xs font-bold tracking-tight text-[#e5e2e3]">CoAide IDE</h2>
            <div className="text-[9px] text-[#555] font-mono">v0.8.2-alpha</div>
          </div>
        </div>

        {/* Section Header */}
        <div className="px-5 py-2.5 flex items-center justify-between text-[9px] font-sans font-bold text-[#666] uppercase tracking-widest border-b border-[#1B1C1E] bg-[#0a0a0b]">
          <span className="flex items-center gap-1.5">
            <FolderOpen size={10} />
            Working Directory
          </span>
          <button 
            onClick={refreshFilesList} 
            title="Refresh Explorer"
            className="hover:text-white transition-colors"
          >
            <RotateCw size={10} />
          </button>
        </div>

        {/* Sandbox File List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5 scrollbar-thin">
          {sandboxFiles.length === 0 ? (
            <span className="text-[10px] text-[#444] font-mono px-2 py-1">No files in sandbox</span>
          ) : (
            sandboxFiles.map((file) => {
              const isActive = file === activeCodeFile;
              let iconColor = "text-[#666]";
              if (file.endsWith(".html")) iconColor = "text-amber-500";
              else if (file.endsWith(".css")) iconColor = "text-blue-500";
              else if (file.endsWith(".js") || file.endsWith(".ts")) iconColor = "text-yellow-500";

              return (
                <div
                  key={file}
                  className={`group flex items-center justify-between rounded transition-colors w-full ${
                    isActive 
                      ? "bg-[#1c1c1c] text-white" 
                      : "text-[#a0a0a0] hover:text-white hover:bg-[#121213]"
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveCodeFile(file);
                      setRightPaneTab("code");
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-left w-full overflow-hidden flex-1"
                  >
                    <FileCode size={12} className={`${iconColor} shrink-0`} />
                    <span className="font-mono text-xs truncate">{file}</span>
                  </button>
                  
                  <button
                    onClick={(e) => handleDeleteFile(e, file)}
                    title={`Delete ${file}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 mr-1 text-[#666] hover:text-red-500 rounded hover:bg-[#222]"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Directory Footer status */}
        <div className="p-4 border-t border-[#1B1C1E] bg-[#0a0a0b] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#666]">
            <Cpu size={10} className="text-emerald-500 shrink-0" />
            <span>SANDBOX: ONLINE</span>
          </div>
        </div>
      </aside>

      {/* Middle Pane - VibeAgent Chat console (resizes) */}
      <main className="flex-1 flex flex-col h-full bg-[#070708] border-r border-[#1B1C1E]">
        {/* Header Status */}
        <header className="h-12 px-5 border-b border-[#1B1C1E] flex items-center justify-between bg-[#0a0a0b] select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-manrope tracking-tight text-[#ffffff]">AI BUILD SESSION</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#121213] border border-[#222] text-[9px] font-mono text-[#a0a0a0]">
              <span className={`w-1 h-1 rounded-full shrink-0 ${agentStatus === "Idle" ? "bg-zinc-500" : "bg-emerald-500 animate-pulse"}`}></span>
              {agentStatus}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.open("/sandbox/index.html", "_blank")}
              className="text-[10px] font-mono text-[#888] hover:text-white transition-colors"
            >
              Open Sandbox Tab ↗
            </button>
          </div>
        </header>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 scrollbar-thin">
          {/* Welcome Greeting */}
          <div className="flex gap-3 animate-fade-in">
            <div className="w-6 h-6 rounded bg-[#1c1c1c] border border-[#333] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[9px] font-bold font-mono text-white">VA</span>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-sans font-semibold text-[#888] mb-0.5">VibeAgent</div>
              <div className="text-xs text-[#d0d0d0] leading-relaxed">
                Welcome to the CoAide Vibe Coding App! I am your autonomous developer agent. Tell me what you would like to build or modify, and I will generate the code files and run them in the sandbox preview.
              </div>
            </div>
          </div>

          {/* Conversations */}
          {messages.map((msg, idx) => (
            <div key={idx} className="flex gap-3 animate-fade-in">
              <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                msg.sender === "You" 
                  ? "bg-[#ffffff] text-[#000000] border-white" 
                  : "bg-[#1c1c1c] text-[#ffffff] border-[#333]"
              }`}>
                <span className="text-[9px] font-bold font-mono">
                  {msg.sender === "You" ? "U" : msg.isThought ? "💭" : "VA"}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-sans font-semibold text-[#888] mb-0.5">{msg.sender}</div>
                
                {msg.isThought ? (
                  <div className="bg-[#121213] border border-[#1b1c1e] p-3 rounded font-mono text-[10px] text-[#888] leading-relaxed whitespace-pre-wrap my-1.5 select-text">
                    <div className="text-[8px] font-sans font-semibold text-[#555] uppercase tracking-wider mb-1 select-none">
                      Agent&apos;s Thought Process
                    </div>
                    {msg.text}
                  </div>
                ) : (
                  <div className="text-xs text-[#d0d0d0] leading-relaxed whitespace-pre-wrap select-text">
                    {renderFormattedText(msg.text)}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Active status indicator in stream */}
          {agentStatus !== "Idle" && agentStatus !== "" && (
            <div className="flex gap-3 items-center text-xs text-[#555] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{agentStatus}</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Prompt Input bar */}
        <div className="p-4 border-t border-[#1B1C1E] bg-[#070708] shrink-0">
          <div className="relative bg-[#101011] border border-[#232426] rounded focus-within:border-[#444] transition-all flex flex-col">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitPrompt();
                }
              }}
              disabled={agentStatus !== "Idle" && agentStatus !== ""}
              className="w-full bg-transparent border-none resize-none p-3 text-xs text-[#ffffff] placeholder-[#444] focus:ring-0 min-h-[60px] outline-none" 
              placeholder="Describe what you want to build or modify in the workspace..."
            />
            <div className="flex items-center justify-between p-2 border-t border-[#1B1C1E]/50 select-none">
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1c1c1c] border border-[#333] text-[9px] font-mono text-[#a0a0a0]">
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                  Engineer Mode
                </span>
              </div>
              <button 
                onClick={handleSubmitPrompt}
                disabled={!prompt.trim() || (agentStatus !== "Idle" && agentStatus !== "")}
                className="w-6 h-6 rounded bg-[#ffffff] text-[#000000] flex items-center justify-center hover:bg-[#e0e0e0] active:scale-95 disabled:opacity-40 disabled:hover:bg-white transition-all duration-150"
              >
                <span className="text-xs font-bold font-mono">↑</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Pane: Code View & Live Preview (100% height) */}
      <section className="flex-1 lg:max-w-[45%] xl:max-w-[40%] flex flex-col h-full bg-[#070708] overflow-hidden">
        {/* Tab Selection Header */}
        <header className="h-12 border-b border-[#1B1C1E] flex bg-[#0a0a0b] shrink-0 justify-between items-center px-4 select-none">
          <div className="flex gap-2">
            <button 
              onClick={() => setRightPaneTab("preview")}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-widest transition-colors rounded ${
                rightPaneTab === "preview" 
                  ? "bg-[#1c1c1c] text-white" 
                  : "text-[#777] hover:text-white"
              }`}
            >
              LIVE PREVIEW
            </button>
            <button 
              onClick={() => setRightPaneTab("code")}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-widest transition-colors rounded ${
                rightPaneTab === "code" 
                  ? "bg-[#1c1c1c] text-white" 
                  : "text-[#777] hover:text-white"
              }`}
            >
              CODE VIEWER
            </button>
          </div>

          <div className="flex items-center gap-2">
            {rightPaneTab === "preview" ? (
              <button 
                onClick={() => setPreviewKey((prev) => prev + 1)}
                title="Reload live preview"
                className="p-1.5 text-[#666] hover:text-white rounded hover:bg-[#121213] transition-colors"
              >
                <RotateCw size={12} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#888]">
                <span>file:</span>
                <span className="text-white bg-[#121213] px-2 py-0.5 rounded border border-[#222]">
                  {activeCodeFile || "none"}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Tab Body Content */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {rightPaneTab === "preview" ? (
            <div className="flex-1 border border-[#1B1C1E] rounded bg-[#ffffff] overflow-hidden flex flex-col shadow-lg">
              {/* Fake browser bar */}
              <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0 justify-between select-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                </div>
                <div className="px-4 py-0.5 rounded bg-white border border-gray-200 text-[8px] text-gray-400 font-mono w-[60%] text-center truncate">
                  localhost:8000/sandbox/{activeCodeFile || "index.html"}
                </div>
                <div className="w-4"></div>
              </div>
              {/* Web Frame */}
              <div className="flex-1 bg-white relative">
                <iframe 
                  src={`/sandbox/${activeCodeFile || "index.html"}?t=${previewKey}`} 
                  className="w-full h-full border-none bg-white"
                  title="Sandbox Live Preview"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-[#1B1C1E] rounded bg-[#0a0a0b] overflow-hidden flex flex-col">
              <div className="h-6 bg-[#121213] border-b border-[#1b1c1e] flex items-center px-3 justify-between shrink-0 select-none">
                <span className="text-[9px] text-[#555] font-mono">{activeCodeFile || "No file selected"}</span>
              </div>
              <pre className="flex-1 p-4 overflow-auto text-[10px] font-mono text-[#a0a0a0] leading-relaxed whitespace-pre-wrap scrollbar-thin select-text">
                <code>{activeCodeContent || "No content loaded."}</code>
              </pre>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-[#000000] flex flex-col items-center justify-center text-[#ffffff] font-mono text-xs gap-3">
        <span className="w-4 h-4 rounded-full border border-t-white border-zinc-800 animate-spin"></span>
        LOADING COAIDE WORKSPACE...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
