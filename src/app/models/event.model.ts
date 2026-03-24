export interface Event {
  id: number;
  createdBy: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  location?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  location?: string;
}

export interface UpdateEventRequest {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  location?: string;
}
