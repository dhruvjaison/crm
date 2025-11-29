'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface InlineContactFormProps {
  onContactCreated: (contactId: string, contactName: string) => void
  onCancel: () => void
}

export function InlineContactForm({ onContactCreated, onCancel }: InlineContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First and last name are required')
      return
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          company: formData.company.trim(),
          status: 'LEAD',
          leadScore: 50,
          tags: [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create contact')
      }

      toast.success('Contact created successfully')
      const fullName = `${formData.firstName} ${formData.lastName}`
      onContactCreated(data.contact.id, fullName)
    } catch (error) {
      console.error('Error creating contact:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Contact
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="inline-firstName" className="text-xs">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="inline-firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
              disabled={loading}
              required
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inline-lastName" className="text-xs">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="inline-lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
              disabled={loading}
              required
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="inline-email" className="text-xs">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john.doe@company.com"
            disabled={loading}
            required
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="inline-phone" className="text-xs">
              Phone
            </Label>
            <Input
              id="inline-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              disabled={loading}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inline-company" className="text-xs">
              Company
            </Label>
            <Input
              id="inline-company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Inc."
              disabled={loading}
              className="h-9"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" size="sm" disabled={loading} className="flex-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create & Select
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

