"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TraceabilityForm } from "./traceability-form"
import { TraceabilityTable } from "./traceability-table"
import type { TraceabilityEvent } from "@/types/traceability"
import type { Visitor } from "@/types/visitor"

type TraceabilityProps = {
  visitors: Visitor[]
}

export function Traceability({ visitors }: TraceabilityProps) {
  const [events, setEvents] = useState<TraceabilityEvent[]>([])

  const addEvent = (event: TraceabilityEvent) => {
    setEvents([...events, event])
  }

  const updateEvent = (updatedEvent: TraceabilityEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Tableau de traçabilité</TabsTrigger>
          <TabsTrigger value="add">Ajouter un événement</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-6">
          <TraceabilityTable events={events} onUpdateEvent={updateEvent} />
        </TabsContent>
        <TabsContent value="add" className="mt-6">
          <TraceabilityForm onAddEvent={addEvent} visitors={visitors} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

