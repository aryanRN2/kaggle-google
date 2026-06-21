"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter as FilterIcon } from "lucide-react";
import { ApprovalRequest } from "@/types/approval";

interface ApprovalsQueueProps {
  requests: ApprovalRequest[];
  selectedRequestId: string;
  onSelectRequest: (req: ApprovalRequest) => void;
}

type FilterTab = "all" | "my-team" | "critical";

export default function ApprovalsQueue({
  requests,
  selectedRequestId,
  onSelectRequest,
}: ApprovalsQueueProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // 1. Search term match
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        req.id.toLowerCase().includes(query) ||
        req.owner.toLowerCase().includes(query) ||
        req.title.toLowerCase().includes(query) ||
        req.team.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Tab filter match
      if (activeTab === "my-team") {
        return req.team === "Sales Ops" || req.team === "Finance"; // mock matches for current user's teams
      }
      if (activeTab === "critical") {
        return req.risk === "Critical" || req.risk === "High";
      }

      return true;
    });
  }, [requests, searchTerm, activeTab]);

  return (
    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar border-r border-[#1B1C1E] bg-[#131314]">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c6c5d8]"
            />
            <input
              className="bg-[#101112] border border-[#1B1C1E] rounded pl-9 pr-3 py-1.5 text-xs w-full sm:w-64 focus:border-[#ffffff] focus:ring-0 focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] text-[#e5e2e3] placeholder:text-[#8f8fa1] transition-all font-mono"
              placeholder="Search requests (ID, Owner)..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#101112] border border-[#1B1C1E] rounded px-3 py-1.5 text-xs text-[#e5e2e3] hover:bg-[#151617] flex items-center gap-2 transition-colors">
            <FilterIcon size={14} />
            Filter
          </button>
        </div>

        {/* Segmented Controller */}
        <div className="flex bg-[#070708] p-1 rounded border border-[#1B1C1E] w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 sm:flex-initial px-3 py-1 text-xs rounded font-sans uppercase transition-all ${
              activeTab === "all"
                ? "bg-[#191A1C] text-[#e5e2e3] shadow-sm font-semibold"
                : "text-[#c6c5d8] hover:text-[#e5e2e3]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("my-team")}
            className={`flex-1 sm:flex-initial px-3 py-1 text-xs rounded font-sans uppercase transition-all ${
              activeTab === "my-team"
                ? "bg-[#191A1C] text-[#e5e2e3] shadow-sm font-semibold"
                : "text-[#c6c5d8] hover:text-[#e5e2e3]"
            }`}
          >
            My Team
          </button>
          <button
            onClick={() => setActiveTab("critical")}
            className={`flex-1 sm:flex-initial px-3 py-1 text-xs rounded font-sans uppercase transition-all ${
              activeTab === "critical"
                ? "bg-[#191A1C] text-[#e5e2e3] shadow-sm font-semibold"
                : "text-[#c6c5d8] hover:text-[#e5e2e3]"
            }`}
          >
            Critical
          </button>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="w-full bg-[#101112] border border-[#1B1C1E] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#151617] border-b border-[#1B1C1E]">
                <th className="py-2.5 px-3 w-8"></th>
                <th className="py-2.5 px-4 font-sans text-[11px] font-semibold text-[#c6c5d8] uppercase tracking-widest">
                  Request
                </th>
                <th className="py-2.5 px-4 font-sans text-[11px] font-semibold text-[#c6c5d8] uppercase tracking-widest">
                  Team
                </th>
                <th className="py-2.5 px-4 font-sans text-[11px] font-semibold text-[#c6c5d8] uppercase tracking-widest">
                  Owner
                </th>
                <th className="py-2.5 px-4 font-sans text-[11px] font-semibold text-[#c6c5d8] uppercase tracking-widest">
                  SLA
                </th>
                <th className="py-2.5 px-4 font-sans text-[11px] font-semibold text-[#c6c5d8] uppercase tracking-widest">
                  Risk
                </th>
                <th className="py-2.5 px-4 font-sans text-[11px] font-semibold text-[#c6c5d8] uppercase tracking-widest text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-[#c6c5d8]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8f8fa1]">
                    No requests found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isSelected = req.id === selectedRequestId;
                  
                  // Grayscale risk badge styling
                  let riskBadgeStyles = "";
                  if (req.risk === "Critical" || req.risk === "High") {
                    riskBadgeStyles = "bg-[#ffffff] text-[#000000] border-[#ffffff]";
                  } else {
                    riskBadgeStyles = "bg-[#1c1c1c] text-[#a0a0a0] border-[#333333]";
                  }

                  let slaTextClass = "text-[#a0a0a0]";
                  if (req.slaStatus === "urgent") {
                    slaTextClass = "text-[#ffffff] font-semibold";
                  } else if (req.slaStatus === "overdue") {
                    slaTextClass = "text-[#ffffff] font-bold underline decoration-[#888888]";
                  }

                  return (
                    <tr
                      key={req.id}
                      onClick={() => onSelectRequest(req)}
                      className={`border-b border-[#1B1C1E] hover:bg-[#151617] cursor-pointer transition-all duration-150 h-[42px] ${
                        isSelected
                          ? "bg-[#151617] border-l-2 border-l-[#ffffff]"
                          : "border-l-2 border-l-transparent"
                      }`}
                    >
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`status-dot ${
                            req.dotColor === "red"
                              ? "status-red"
                              : req.dotColor === "green"
                              ? "status-green"
                              : "status-amber"
                          }`}
                        ></span>
                      </td>
                      <td className="py-2 px-4 text-[#e5e2e3] font-medium font-sans">
                        {req.title}
                      </td>
                      <td className="py-2 px-4">{req.team}</td>
                      <td className="py-2 px-4">{req.owner}</td>
                      <td className={`py-2 px-4 ${slaTextClass}`}>{req.sla}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase border ${riskBadgeStyles}`}
                        >
                          {req.risk}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span
                          className={
                            req.status === "Blocked" ? "text-[#ffffff] font-semibold" : "text-[#a0a0a0]"
                          }
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
