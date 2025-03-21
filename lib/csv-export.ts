export function exportToCsv(data: Record<string, any>[], filename: string) {
  if (!data || !data.length) {
    return
  }

  // Récupérer les en-têtes à partir des clés du premier objet
  const headers = Object.keys(data[0])

  // Créer la ligne d'en-tête
  let csvContent = headers.join(";") + "\n"

  // Ajouter les lignes de données
  data.forEach((item) => {
    const row = headers.map((header) => {
      // Échapper les guillemets et entourer de guillemets si nécessaire
      const cell = String(item[header] || "")
      if (cell.includes(";") || cell.includes('"') || cell.includes("\n")) {
        return `"${cell.replace(/"/g, '""')}"`
      }
      return cell
    })
    csvContent += row.join(";") + "\n"
  })

  // Ajouter le BOM pour l'encodage UTF-8 (pour Excel)
  const bom = new Uint8Array([0xef, 0xbb, 0xbf])
  const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8;" })

  // Créer un lien de téléchargement
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

