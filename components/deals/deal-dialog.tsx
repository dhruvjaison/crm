'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { Loader2, Search, HelpCircle, DollarSign } from 'lucide-react'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface PipelineStage {
  id: string
  name: string
  order: number
  probability: number
}

interface Deal {
  id: string
  title: string
  value: number
  contactId: string
  stageId: string
  expectedCloseDate?: string
  description?: string
}

interface DealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal?: Deal | null
  onSuccess?: () => void
}

export function DealDialog({ open, onOpenChange, deal, onSuccess }: DealDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    contactId: '',
    stageId: '',
    expectedCloseDate: '',
  })

  // Load contacts and stages
  useEffect(() => {
    if (open) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Populate form when editing
  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value.toString() || '',
        contactId: deal.contactId || '',
        stageId: deal.stageId || '',
        expectedCloseDate: deal.expectedCloseDate || '',
      })
    } else {
      // Reset form when creating new
      setFormData({
        title: '',
        value: '',
        contactId: '',
        stageId: '',
        expectedCloseDate: '',
      })
    }
  }, [deal, open])

  const loadData = async () => {
    setLoadingData(true)
    try {
      // Load contacts and stages in parallel
      const [contactsRes, stagesRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/pipeline/stages'),
      ])

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json()
        setContacts(contactsData.contacts || [])
      }

      if (stagesRes.ok) {
        const stagesData = await stagesRes.json()
        setStages(stagesData.stages || [])
        // Set first stage as default if creating new deal
        if (!deal && stagesData.stages?.length > 0) {
          setFormData(prev => ({ ...prev, stageId: stagesData.stages[0].id }))
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load form data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Deal title is required')
      return
    }
    if (!formData.value || parseFloat(formData.value) <= 0) {
      toast.error('Deal value must be greater than 0')
      return
    }
    if (!formData.contactId) {
      toast.error('Please select a contact')
      return
    }
    if (!formData.stageId) {
      toast.error('Please select a pipeline stage')
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title.trim(),
        value: parseFloat(formData.value),
        contactId: formData.contactId,
        stageId: formData.stageId,
        expectedCloseDate: formData.expectedCloseDate || undefined,
      }

      const url = deal ? `/api/deals/${deal.id}` : '/api/deals'
      const method = deal ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save deal')
      }

      toast.success(deal ? 'Deal updated successfully' : 'Deal created successfully')
      onOpenChange(false)
      
      // Callback for parent to refresh data
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Error saving deal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save deal')
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
    const email = contact.email.toLowerCase()
    const search = searchTerm.toLowerCase()
    return fullName.includes(search) || email.includes(search)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{deal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
          <DialogDescription>
            {deal ? 'Update deal information' : 'Add a new deal to your pipeline'}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TooltipProvider>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Deal Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Deal Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Q4 Enterprise License"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Value & Expected Close Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="value">
                        Deal Value ($) <span className="text-red-500">*</span>
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Enter the total potential value of this deal in USD. This helps track your pipeline value and forecast revenue.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder="50000.00"
                        disabled={loading}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            When do you expect to close this deal? This helps with revenue forecasting and prioritization.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="expectedCloseDate"
                      type="date"
                      value={formData.expectedCloseDate}
                      onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>

              {/* Contact Selection */}
              <div className="space-y-2">
                <Label htmlFor="contactId">
                  Contact <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Which contact is this deal for? Search by name or email below.
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Type to search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 mb-2"
                    disabled={loading}
                  />
                </div>
                <Select
                  value={formData.contactId}
                  onValueChange={(value) => setFormData({ ...formData, contactId: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="contactId" className="h-11">
                    <SelectValue placeholder="Select a contact from the list" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredContacts.length === 0 ? (
                      <div className="p-4 text-sm text-center">
                        <p className="text-muted-foreground mb-2">No contacts found</p>
                        <p className="text-xs text-muted-foreground">
                          {searchTerm ? 'Try a different search term' : 'Create a contact first'}
                        </p>
                      </div>
                    ) : (
                      filteredContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id} className="py-3 cursor-pointer">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {contact.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!formData.contactId && (
                  <p className="text-xs text-amber-600">
                    ⚠️ You must select a contact to create a deal
                  </p>
                )}
              </div>

              {/* Pipeline Stage */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="stageId">
                    Pipeline Stage <span className="text-red-500">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        Select where this deal is in your sales pipeline. Each stage has a probability of closing that affects your revenue forecast.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.stageId}
                  onValueChange={(value) => setFormData({ ...formData, stageId: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="stageId" className="h-11">
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id} className="py-3">
                        {stage.name} ({stage.probability}% probability)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {deal ? 'Update Deal' : 'Create Deal'}
              </Button>
            </DialogFooter>
            </form>
          </TooltipProvider>
        )}
      </DialogContent>
    </Dialog>
  )
}

