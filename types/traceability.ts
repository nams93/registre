export type EventType = "badge_lost" | "badge_found" | "incident" | "other"

export interface TraceabilityEvent {
  id: string
  visitorId?: string
  visitorName: string
  eventType: EventType
  description: string
  date: Date
  createdAt: string
  status: "open" | "resolved"
  resolvedAt?: string
  resolvedBy?: string
}

