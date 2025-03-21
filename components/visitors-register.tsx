"use client"

import { useState, useEffect } from "react"
import { VisitorForm } from "@/components/visitor-form"
import { VisitorsList } from "@/components/visitors-list"
import { VisitorSearch } from "@/components/visitor-search"
import { Traceability } from "@/components/traceability"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Visitor } from "@/types/visitor"
import { visitPurposeLabels } from "@/types/visit-purpose"
import { saveVisitors, getVisitors } from "@/lib/storage-service"

export default function VisitorsRegister() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [searchResults, setSearchResults] = useState<Visitor[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState("register")

  // Charger les visiteurs depuis le localStorage au chargement initial
  useEffect(() => {
    const savedVisitors = getVisitors()
    if (savedVisitors.length > 0) {
      setVisitors(savedVisitors)
    }
  }, [])

  // Sauvegarder les visiteurs dans le localStorage à chaque modification
  useEffect(() => {
    if (visitors.length > 0) {
      saveVisitors(visitors)
    }
  }, [visitors])

  const addVisitor = (visitor: Visitor) => {
    const newVisitors = [...visitors, { ...visitor, id: Date.now().toString() }]
    setVisitors(newVisitors)
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setIsSearching(false)
      return
    }

    const results = visitors.filter(
      (visitor) =>
        visitor.name.toLowerCase().includes(query.toLowerCase()) ||
        visitor.company.toLowerCase().includes(query.toLowerCase()) ||
        visitor.email.toLowerCase().includes(query.toLowerCase()) ||
        (visitor.badgeNumber && visitor.badgeNumber.toLowerCase().includes(query.toLowerCase())) ||
        visitPurposeLabels[visitor.purpose].toLowerCase().includes(query.toLowerCase()) ||
        (visitor.purposeDetails && visitor.purposeDetails.toLowerCase().includes(query.toLowerCase())),
    )

    setSearchResults(results)
    setIsSearching(true)
  }

  const clearSearch = () => {
    setIsSearching(false)
    setSearchResults([])
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="register" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="register">Enregistrer</TabsTrigger>
          <TabsTrigger value="list">Liste des Visiteurs</TabsTrigger>
          <TabsTrigger value="search">Rechercher</TabsTrigger>
          <TabsTrigger value="traceability">Traçabilité</TabsTrigger>
        </TabsList>
        <TabsContent value="register" className="mt-6">
          <VisitorForm onAddVisitor={addVisitor} />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <VisitorsList visitors={visitors} />
        </TabsContent>
        <TabsContent value="search" className="mt-6">
          <VisitorSearch
            onSearch={handleSearch}
            onClear={clearSearch}
            searchResults={searchResults}
            isSearching={isSearching}
          />
        </TabsContent>
        <TabsContent value="traceability" className="mt-6">
          <Traceability visitors={visitors} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

