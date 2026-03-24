export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  location?: string;
  organizerId: number;
  organizer?: { id: number; name: string; email: string };
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
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  location?: string;
}
