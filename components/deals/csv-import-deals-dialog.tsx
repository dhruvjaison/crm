'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react'
import { toast } from 'sonner'

interface CSVImportDealsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: () => void
}

interface ImportResult {
  created: number
  updated: number
  skipped: number
  errors: Array<{ row: number; error: string }>
}

export function CSVImportDealsDialog({ open, onOpenChange, onImportComplete }: CSVImportDealsDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [updateExisting, setUpdateExisting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [preview, setPreview] = useState<Record<string, string>[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setResult(null)

    // Parse CSV for preview
    const text = await selectedFile.text()
    const rows = parseCSV(text)
    setPreview(rows.slice(0, 5)) // Show first 5 rows
  }

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const rows: Record<string, string>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }

    return rows
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const deals = parseCSV(text)

      const res = await fetch('/api/deals/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deals, updateExisting }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data.result)
      toast.success(`Import complete! ${data.result.created} created, ${data.result.updated} updated`)
      
      // Refresh the deals list
      onImportComplete()
    } catch (error) {
      console.error('Import error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to import deals')
    } finally {
      setImporting(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview([])
    setResult(null)
    setUpdateExisting(false)
    onOpenChange(false)
  }

  const downloadTemplate = () => {
    const template = 'title,value,contactEmail,contactPhone,stageName,status,expectedCloseDate,notes\nNew Deal,$5000,john@example.com,+1234567890,Discovery,OPEN,2024-12-31,Sample notes'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'deals-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Deals from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple deals at once. Contacts must exist first.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Need a template?</span>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          {!result && (
            <>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload-deals"
                />
                <label htmlFor="csv-upload-deals" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    {file ? file.name : 'Click to upload CSV file'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV files only (max 10MB)
                  </p>
                </label>
              </div>

              {/* Preview */}
              {preview.length > 0 && (
                <div>
                  <Label className="mb-2 block">Preview (first 5 rows)</Label>
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(preview[0]).map(key => (
                            <th key={key} className="px-3 py-2 text-left font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => (
                          <tr key={i} className="border-t">
                            {Object.values(row).map((value, j) => (
                              <td key={j} className="px-3 py-2">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Options */}
              {file && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="update-existing-deals" className="cursor-pointer">
                      Update existing deals
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      If a deal with the same title and contact exists, update it
                    </p>
                  </div>
                  <Switch
                    id="update-existing-deals"
                    checked={updateExisting}
                    onCheckedChange={setUpdateExisting}
                  />
                </div>
              )}
            </>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{result.created}</p>
                    <p className="text-xs text-green-600">Created</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{result.updated}</p>
                    <p className="text-xs text-blue-600">Updated</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                  <XCircle className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-600">{result.skipped}</p>
                    <p className="text-xs text-gray-600">Skipped</p>
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="border rounded-lg p-3 bg-red-50 dark:bg-red-950">
                  <p className="font-medium text-sm text-red-600 mb-2">Errors:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.map((error, i) => (
                      <p key={i} className="text-xs text-red-600">
                        Row {error.row}: {error.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              {result ? 'Close' : 'Cancel'}
            </Button>
            {!result && file && (
              <Button onClick={handleImport} disabled={importing}>
                {importing ? 'Importing...' : `Import ${preview.length} Deals`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

