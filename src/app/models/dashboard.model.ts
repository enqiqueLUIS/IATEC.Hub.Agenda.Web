export interface DashboardEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  creatorName: string;
}

export interface DashboardData {
  ongoingEvents: DashboardEvent[];
  upcomingEvents: DashboardEvent[];
}

export interface DashboardResponse {
  data: DashboardData;
  messages: { type: string; description: string }[];
}