'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
}

interface EmailTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: EmailTemplate | null
  onSuccess: () => void
}

const COMMON_VARIABLES = [
  'firstName',
  'lastName',
  'email',
  'company',
  'phone',
  'jobTitle',
]

export function EmailTemplateDialog({ open, onOpenChange, template, onSuccess }: EmailTemplateDialogProps) {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [variables, setVariables] = useState<string[]>([])
  const [newVariable, setNewVariable] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (template) {
      setName(template.name)
      setSubject(template.subject)
      setBody(template.body)
      setVariables(template.variables)
    } else {
      setName('')
      setSubject('')
      setBody('')
      setVariables([])
    }
  }, [template])

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template-body') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = body
    const before = text.substring(0, start)
    const after = text.substring(end)
    const newText = before + `{{${variable}}}` + after

    setBody(newText)

    // Add to variables list if not already there
    if (!variables.includes(variable)) {
      setVariables([...variables, variable])
    }

    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4)
    }, 0)
  }

  const addCustomVariable = () => {
    if (!newVariable.trim()) return
    const variable = newVariable.trim()
    if (!variables.includes(variable)) {
      setVariables([...variables, variable])
    }
    setNewVariable('')
  }

  const removeVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable))
  }

  const handleSave = async () => {
    if (!name.trim() || !subject.trim() || !body.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const url = template
        ? `/api/email-templates/${template.id}`
        : '/api/email-templates'
      
      const res = await fetch(url, {
        method: template ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          subject,
          body,
          variables,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save template')
      }

      toast.success(template ? 'Template updated' : 'Template created')
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create Template'}</DialogTitle>
          <DialogDescription>
            Create reusable email templates with dynamic variables
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Name */}
          <div>
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Welcome Email, Follow-up"
            />
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject Line *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Welcome to {{company}}!"
            />
          </div>

          {/* Variables */}
          <div>
            <Label>Available Variables</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {COMMON_VARIABLES.map(variable => (
                <Button
                  key={variable}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(variable)}
                >
                  {`{{${variable}}}`}
                </Button>
              ))}
            </div>

            {/* Custom Variables */}
            {variables.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <Label className="w-full text-xs text-muted-foreground">Custom Variables:</Label>
                {variables.filter(v => !COMMON_VARIABLES.includes(v)).map(variable => (
                  <Badge key={variable} variant="secondary">
                    {`{{${variable}}}`}
                    <button
                      onClick={() => removeVariable(variable)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Custom Variable */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add custom variable"
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomVariable()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addCustomVariable}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div>
            <Label htmlFor="template-body">Email Body *</Label>
            <Textarea
              id="template-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Hi {{firstName}},&#10;&#10;Welcome to {{company}}! We're excited to have you on board.&#10;&#10;Best regards,&#10;The Team"
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use {`{{variableName}}`} to insert dynamic content
            </p>
          </div>

          {/* Preview */}
          <div>
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-muted/50 mt-2">
              <p className="font-semibold mb-2">Subject: {subject || '(No subject)'}</p>
              <div className="whitespace-pre-wrap text-sm">
                {body || '(No content)'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

