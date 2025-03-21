import type { Visitor } from "@/types/visitor"
import type { TraceabilityEvent } from "@/types/traceability"

// Clés pour le localStorage
const STORAGE_KEYS = {
  VISITORS: "gpis_visitors",
  TRACEABILITY_EVENTS: "gpis_traceability_events",
  VISITOR_FORM: "gpis_visitor_form_draft",
  TRACEABILITY_FORM: "gpis_traceability_form_draft",
}

// Fonction pour sauvegarder les visiteurs
export function saveVisitors(visitors: Visitor[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitors))
  }
}

// Fonction pour récupérer les visiteurs
export function getVisitors(): Visitor[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.VISITORS)
    if (data) {
      try {
        const visitors = JSON.parse(data) as Visitor[]
        // Convertir les dates de string à Date
        return visitors.map((visitor) => ({
          ...visitor,
          date: new Date(visitor.date),
        }))
      } catch (error) {
        console.error("Erreur lors de la récupération des visiteurs:", error)
      }
    }
  }
  return []
}

// Fonction pour sauvegarder les événements de traçabilité
export function saveTraceabilityEvents(events: TraceabilityEvent[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TRACEABILITY_EVENTS, JSON.stringify(events))
  }
}

// Fonction pour récupérer les événements de traçabilité
export function getTraceabilityEvents(): TraceabilityEvent[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.TRACEABILITY_EVENTS)
    if (data) {
      try {
        const events = JSON.parse(data) as TraceabilityEvent[]
        // Convertir les dates de string à Date
        return events.map((event) => ({
          ...event,
          date: new Date(event.date),
        }))
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error)
      }
    }
  }
  return []
}

// Fonction pour sauvegarder le brouillon du formulaire visiteur
export function saveVisitorFormDraft(formData: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.VISITOR_FORM, JSON.stringify(formData))
  }
}

// Fonction pour récupérer le brouillon du formulaire visiteur
export function getVisitorFormDraft(): any {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.VISITOR_FORM)
    if (data) {
      try {
        const formData = JSON.parse(data)
        // Convertir la date de string à Date si elle existe
        if (formData.date) {
          formData.date = new Date(formData.date)
        }
        return formData
      } catch (error) {
        console.error("Erreur lors de la récupération du brouillon du formulaire visiteur:", error)
      }
    }
  }
  return null
}

// Fonction pour supprimer le brouillon du formulaire visiteur
export function clearVisitorFormDraft(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.VISITOR_FORM)
  }
}

// Fonction pour sauvegarder le brouillon du formulaire de traçabilité
export function saveTraceabilityFormDraft(formData: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TRACEABILITY_FORM, JSON.stringify(formData))
  }
}

// Fonction pour récupérer le brouillon du formulaire de traçabilité
export function getTraceabilityFormDraft(): any {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.TRACEABILITY_FORM)
    if (data) {
      try {
        const formData = JSON.parse(data)
        // Convertir la date de string à Date si elle existe
        if (formData.date) {
          formData.date = new Date(formData.date)
        }
        return formData
      } catch (error) {
        console.error("Erreur lors de la récupération du brouillon du formulaire de traçabilité:", error)
      }
    }
  }
  return null
}

// Fonction pour supprimer le brouillon du formulaire de traçabilité
export function clearTraceabilityFormDraft(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.TRACEABILITY_FORM)
  }
}

