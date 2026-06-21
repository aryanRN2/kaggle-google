"use client";

import React from "react";
import { 
  ExternalLink, 
  Info, 
  User, 
  Link as LinkIcon, 
  FileSpreadsheet, 
  AlertTriangle, 
  History, 
  Check, 
  X, 
  MessageSquare,
  ShieldAlert
} from "lucide-react";
import { ApprovalRequest } from "@/types/approval";
import { AnomalousMatterHero } from "@/components/ui/anomalous-matter-hero";

interface DetailPanelProps {
  request: ApprovalRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestInfo: (id: string) => void;
}

export default function DetailPanel({
  request,
  onApprove,
  onReject,
  onRequestInfo,
}: DetailPanelProps) {
  if (!request) {
    return (
      <div className="w-full lg:w-96 bg-[#131314] flex flex-col h-full border-t lg:border-t-0 border-[#1B1C1E] items-center justify-center p-6 text-center text-[#8f8fa1]">
        <ShieldAlert size={36} className="mb-2 text-[#454655]" />
        <p className="text-sm">Select an approval request from the queue to view full context and metrics.</p>
      </div>
    );
  }

  // Choose colors for dots
  const statusColorClass =
    request.dotColor === "red"
      ? "status-red"
      : request.dotColor === "green"
      ? "status-green"
      : "status-amber";

  return (
    <div className="w-full lg:w-96 bg-[#131314] flex flex-col h-full border-t lg:border-t-0 border-[#1B1C1E] z-10">
      
      {/* 3D Telemetry Visualizer Card (Anomaly Matter) */}
      <div className="h-44 w-full p-2 bg-[#0e0e0f] border-b border-[#1B1C1E]">
        <AnomalousMatterHero
          title={`TELEMETRY LOG: ${request.id}`}
          subtitle="anomaly wireframe active"
          description="Mouse hover changes point light positioning."
        />
      </div>

      {/* Detail Header */}
      <div className="p-5 border-b border-[#1B1C1E] bg-[#101112]">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`status-dot ${statusColorClass}`}></span>
            <span className="text-xs font-mono text-[#c6c5d8]">{request.id}</span>
          </div>
          <button className="text-[#c6c5d8] hover:text-[#e5e2e3] transition-colors">
            <ExternalLink size={16} />
          </button>
        </div>
        <h3 className="font-manrope text-base font-bold text-[#e5e2e3] mb-1">
          {request.title}
        </h3>
        <div className="text-xs text-[#c6c5d8] font-sans leading-relaxed line-clamp-3">
          {request.description}
        </div>
      </div>

      {/* Detail Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col gap-5 bg-[#0e0e0f]">
        
        {/* Context Section */}
        <section>
          <h4 className="font-sans text-[10px] font-semibold text-[#c6c5d8] uppercase tracking-widest mb-2 flex items-center gap-2">
            <Info size={12} className="text-[#c6c5d8]" /> Context
          </h4>
          <div className="bg-[#151617] border border-[#1B1C1E] rounded p-3 grid grid-cols-2 gap-y-3 gap-x-4">
            <div>
              <div className="text-[9px] text-[#8f8fa1] uppercase mb-0.5">Requested By</div>
              <div className="text-xs text-[#e5e2e3] font-mono flex items-center gap-1">
                <User size={10} /> {request.context.requestedBy}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-[#8f8fa1] uppercase mb-0.5">Impact</div>
              <div className="text-xs text-[#e5e2e3] font-mono">
                {request.context.impact}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-[#8f8fa1] uppercase mb-0.5">Account Health</div>
              <div className="text-xs text-[#ffffff] font-mono font-medium">
                {request.context.accountHealth}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-[#8f8fa1] uppercase mb-0.5">SLA Deadline</div>
              <div className="text-xs text-[#ffffff] font-mono">
                {request.context.slaDeadline}
              </div>
            </div>
          </div>
        </section>

        {/* Linked Signals Section */}
        <section>
          <h4 className="font-sans text-[10px] font-semibold text-[#c6c5d8] uppercase tracking-widest mb-2 flex items-center gap-2">
            <LinkIcon size={12} /> Linked Signals
          </h4>
          <div className="flex flex-col gap-2">
            {request.linkedSignals.map((signal, index) => {
              const SignalIcon = signal.type === "warning" ? AlertTriangle : FileSpreadsheet;
              return (
                <div
                  key={index}
                  className="bg-[#151617] border border-[#1B1C1E] rounded p-2.5 flex items-start gap-2.5 hover:border-[#454655] cursor-pointer transition-colors"
                >
                  <SignalIcon
                    size={14}
                    className={`mt-0.5 ${
                      signal.type === "warning" ? "text-[#ffffff]" : "text-[#c6c5d8]"
                    }`}
                  />
                  <div>
                    <div className="text-xs text-[#e5e2e3] font-medium">{signal.title}</div>
                    <div className="text-[10px] text-[#c6c5d8] font-mono">{signal.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* History Feed */}
        <section className="mb-2">
          <h4 className="font-sans text-[10px] font-semibold text-[#c6c5d8] uppercase tracking-widest mb-2 flex items-center gap-2">
            <History size={12} /> History
          </h4>
          <div className="relative border-l border-[#232426] ml-2 pl-4 py-1 flex flex-col gap-4">
            {request.history.map((hist, index) => (
              <div key={index} className="relative">
                <div className="absolute w-2 h-2 rounded-full bg-[#353436] -left-[21px] top-1"></div>
                <div className="text-[10px] text-[#8f8fa1] font-mono mb-0.5">
                  {hist.time}
                </div>
                <div className="text-xs text-[#e5e2e3]">{hist.text}</div>
                {hist.subtext && (
                  <div className="text-[10px] text-[#c6c5d8] mt-0.5">
                    {hist.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Detail Actions (Sticky Bottom) */}
      <div className="p-4 bg-[#101112] border-t border-[#1B1C1E] shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(request.id)}
            disabled={request.status === "Approved"}
            className={`flex-1 rounded py-2 text-xs font-semibold uppercase tracking-wider flex justify-center items-center gap-1 transition-all duration-200 ${
              request.status === "Approved"
                ? "bg-[#1c1b1d] text-[#8f8fa1] border border-[#333] cursor-not-allowed"
                : "bg-[#ffffff] text-[#000000] hover:bg-[#e0e0e0] active:scale-95"
            }`}
          >
            <Check size={14} /> {request.status === "Approved" ? "Approved" : "Approve"}
          </button>
          <button
            onClick={() => onReject(request.id)}
            disabled={request.status === "Rejected"}
            className={`flex-1 rounded py-2 text-xs font-semibold uppercase tracking-wider flex justify-center items-center gap-1 transition-all duration-200 ${
              request.status === "Rejected"
                ? "bg-[#1c1b1d] text-[#8f8fa1] border border-[#333] cursor-not-allowed"
                : "bg-transparent border border-[#333] text-[#ffffff] hover:bg-[#1c1c1c] active:scale-95"
            }`}
          >
            <X size={14} /> {request.status === "Rejected" ? "Rejected" : "Reject"}
          </button>
        </div>
        <button
          onClick={() => onRequestInfo(request.id)}
          className="w-full mt-2 text-xs text-[#c6c5d8] hover:text-[#e5e2e3] py-1 transition-colors flex justify-center items-center gap-1"
        >
          <MessageSquare size={12} /> Request More Info
        </button>
      </div>
    </div>
  );
}
