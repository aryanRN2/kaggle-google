import { ApprovalRequest } from "@/types/approval";

export const mockRequests: ApprovalRequest[] = [
  {
    id: "REQ-882",
    title: "Approve pricing exception REQ-882",
    description: "Requesting 15% discount exception for Enterprise renewal (Acme Corp). Exceeds standard 10% tier band.",
    team: "Sales Ops",
    owner: "J. Doe",
    sla: "12m left",
    slaStatus: "urgent",
    risk: "High",
    status: "Pending Review",
    dotColor: "amber",
    context: {
      requestedBy: "J. Doe",
      impact: "-$12,500 ARR",
      accountHealth: "Good (84/100)",
      slaDeadline: "14:30 UTC (12m left)",
    },
    linkedSignals: [
      {
        type: "contract",
        title: "Previous Renewal Exception",
        desc: "Approved 12% exception on 2023-04-15",
      },
      {
        type: "warning",
        title: "Usage Drop",
        desc: "Active seats down 5% in last 30 days",
      },
    ],
    history: [
      {
        time: "10:15 AM (2h ago)",
        text: "Escalated to Tier 2 by System",
        subtext: "Rule: Exception > 10% requires Director approval.",
      },
      {
        time: "09:30 AM (3h ago)",
        text: "Request submitted by J. Doe",
      },
    ],
  },
  {
    id: "ADJ-091",
    title: "Resolve billing adjustment ADJ-091",
    description: "Resolve billing mismatch on monthly billing statement. Customer is requesting refund for duplicate subscription charges incurred during system migration.",
    team: "Finance",
    owner: "M. Smith",
    sla: "-2h overdue",
    slaStatus: "overdue",
    risk: "Critical",
    status: "Blocked",
    dotColor: "red",
    context: {
      requestedBy: "M. Smith",
      impact: "$8,200 billing discrepancy",
      accountHealth: "Fair (62/100)",
      slaDeadline: "09:30 UTC (-2h overdue)",
    },
    linkedSignals: [
      {
        type: "warning",
        title: "Disputed Invoice",
        desc: "Customer claims dual charge for migration cycle",
      },
      {
        type: "info",
        title: "Credit Check",
        desc: "Outstanding payment pending on other account lines",
      },
    ],
    history: [
      {
        time: "09:00 AM (3h ago)",
        text: "Assigned to M. Smith",
      },
      {
        time: "08:45 AM (3h ago)",
        text: "Flagged by billing reconciliation pipeline",
      },
    ],
  },
  {
    id: "CL-442",
    title: "Extend resource quota CL-442",
    description: "Extend resource quota to add 10 additional GPU nodes to namespace prod-cluster-east to handle peak ingestion training cycle.",
    team: "Infrastructure",
    owner: "A. Chen",
    sla: "4h",
    slaStatus: "normal",
    risk: "Low",
    status: "Pending",
    dotColor: "amber",
    context: {
      requestedBy: "A. Chen",
      impact: "+$4,500/mo infrastructure spend",
      accountHealth: "Great (95/100)",
      slaDeadline: "18:00 UTC (4h left)",
    },
    linkedSignals: [
      {
        type: "info",
        title: "Namespace Utilization",
        desc: "Namespace CPU utilization >85% for 4 consecutive hours",
      },
      {
        type: "contract",
        title: "Previous Increase",
        desc: "Previous limit increase approved 3 weeks ago",
      },
    ],
    history: [
      {
        time: "07:30 AM (5h ago)",
        text: "Request submitted by A. Chen",
      },
    ],
  },
  {
    id: "VEND-12",
    title: "Vendor access provision VEND-12",
    description: "Provide temporary SSH access to vendor consultant for database tuning session scheduled for tonight.",
    team: "Security",
    owner: "K. Lee",
    sla: "1d",
    slaStatus: "normal",
    risk: "Med",
    status: "Pending",
    dotColor: "amber",
    context: {
      requestedBy: "K. Lee",
      impact: "Security compliance audit flag",
      accountHealth: "N/A",
      slaDeadline: "23:59 UTC (1d left)",
    },
    linkedSignals: [
      {
        type: "contract",
        title: "NDA Signed",
        desc: "Consultancy agreement active through 2026-12",
      },
      {
        type: "info",
        title: "Vendor Risk Assessment",
        desc: "Completed on 2026-05-10 with low risk score",
      },
    ],
    history: [
      {
        time: "06:15 AM (6h ago)",
        text: "Request submitted by K. Lee",
      },
    ],
  },
];
