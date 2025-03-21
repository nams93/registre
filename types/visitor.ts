import type { VisitPurposeType } from "./visit-purpose"

export interface Visitor {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  purpose: VisitPurposeType
  purposeDetails?: string
  date: Date
  time: string
  notes?: string
  createdAt: string
  badgeNumber?: string
  signature?: string
}

