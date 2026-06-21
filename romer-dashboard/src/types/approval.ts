export interface LinkedSignal {
  type: "info" | "warning" | "contract";
  title: string;
  desc: string;
}

export interface HistoryItem {
  time: string;
  text: string;
  subtext?: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  team: string;
  owner: string;
  sla: string;
  slaStatus: "urgent" | "overdue" | "normal";
  risk: "Low" | "Med" | "High" | "Critical";
  status: string;
  dotColor: "amber" | "red" | "green";
  context: {
    requestedBy: string;
    impact: string;
    accountHealth: string;
    slaDeadline: string;
  };
  linkedSignals: LinkedSignal[];
  history: HistoryItem[];
}
