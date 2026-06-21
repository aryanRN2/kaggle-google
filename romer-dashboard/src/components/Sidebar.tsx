"use client";

import React from "react";
import { 
  Terminal, 
  Radio, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  FileText, 
  HelpCircle, 
  MessageSquare 
} from "lucide-react";

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ currentTab = "Approvals", onTabChange }: SidebarProps) {
  const navItems = [
    { name: "Command", icon: Terminal },
    { name: "Signals", icon: Radio },
    { name: "Approvals", icon: ShieldCheck },
    { name: "Dashboards", icon: BarChart3 },
    { name: "Customers", icon: Users },
    { name: "Reports", icon: FileText },
  ];

  return (
    <nav className="bg-[#0e0e0f] border-r border-[#454655]/40 flex flex-col h-full fixed left-0 top-0 z-40 w-64 pt-6 pb-8 hidden md:flex">
      {/* Brand Header */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-full border border-[#333] bg-[#121212] flex items-center justify-center overflow-hidden">
          <span className="text-[#ffffff] font-bold text-sm">R</span>
        </div>
        <div>
          <h2 className="font-manrope text-lg font-bold tracking-tight text-[#e5e2e3]">OPERATIONS</h2>
          <div className="text-[10px] text-[#c6c5d8] font-mono opacity-70">v2.4.0-stable</div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 flex flex-col gap-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.name === currentTab;
          return (
            <button
              key={item.name}
              onClick={() => onTabChange && onTabChange(item.name)}
              className={`group flex items-center gap-3 px-4 py-2 rounded text-left transition-all duration-200 w-full ${
                isActive
                  ? "text-[#ffffff] bg-[#1c1c1c] border-r-2 border-[#ffffff]"
                  : "text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#222222]/50"
              }`}
            >
              <Icon size={18} className={isActive ? "stroke-[#ffffff]" : ""} />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer / Meta Actions */}
      <div className="px-4 mt-auto flex flex-col gap-2 border-t border-[#1B1C1E] pt-6">
        <button className="mb-2 flex items-center justify-center gap-2 w-full py-2 px-4 rounded bg-[#ffffff] text-[#000000] font-sans text-xs font-semibold uppercase tracking-widest hover:bg-[#e0e0e0] active:scale-95 transition-all duration-200">
          <Terminal size={14} />
          Launch Terminal
        </button>
        <a className="group flex items-center gap-3 px-4 py-1.5 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#2a2a2b]/50 transition-all duration-200" href="#">
          <HelpCircle size={18} />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest">Docs</span>
        </a>
        <a className="group flex items-center gap-3 px-4 py-1.5 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#2a2a2b]/50 transition-all duration-200" href="#">
          <MessageSquare size={18} />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest">Support</span>
        </a>
      </div>
    </nav>
  );
}
