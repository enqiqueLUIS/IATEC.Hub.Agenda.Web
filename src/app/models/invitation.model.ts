export interface InvitationEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface InvitationUser {
  id: number;
  name: string;
  email: string;
}

export interface Invitation {
  id: number;
  eventId: number;
  invitedByUserId: number;
  invitedUserId: number;
  sentAt: string;
  status: string;
  eventInfo?: InvitationEvent;
  sentBy?: InvitationUser;
}

export interface SendInvitationRequest {
  eventId: number;
  invitedUserId: number;
}