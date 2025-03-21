"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Save } from "lucide-react"

type AutoSaveIndicatorProps = {
  saving?: boolean
  className?: string
}

export function AutoSaveIndicator({ saving = false, className = "" }: AutoSaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false)
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    if (saving) {
      setStatus("saving")
      const timer = setTimeout(() => {
        setStatus("saved")
        setShowSaved(true)

        const hideTimer = setTimeout(() => {
          setShowSaved(false)
          setStatus("idle")
        }, 2000)

        return () => clearTimeout(hideTimer)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [saving])

  if (status === "idle" && !showSaved) return null

  return (
    <div className={`flex items-center text-xs text-muted-foreground ${className}`}>
      {status === "saving" ? (
        <>
          <Save className="h-3 w-3 mr-1 animate-pulse" />
          Sauvegarde en cours...
        </>
      ) : (
        <>
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          Sauvegardé
        </>
      )}
    </div>
  )
}

