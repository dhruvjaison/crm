import { UserPlus, Upload, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface NoContactsProps {
  onAddContact?: () => void
  onImportCSV?: () => void
}

export function NoContacts({ onAddContact, onImportCSV }: NoContactsProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <UserPlus className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">No contacts yet</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Start building your customer database. Add contacts manually or import them from a CSV file.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" onClick={onAddContact}>
          <UserPlus className="mr-2 h-5 w-5" />
          Add Your First Contact
        </Button>
        <Button size="lg" variant="outline" onClick={onImportCSV}>
          <Upload className="mr-2 h-5 w-5" />
          Import from CSV
        </Button>
      </div>
      
      <div className="mt-8 pt-8 border-t w-full">
        <h4 className="font-medium mb-3">Quick Tips:</h4>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <FileSpreadsheet className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <span className="font-medium text-foreground">Import your data</span>
              <p>Upload a CSV with columns like: Name, Email, Phone, Company</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <UserPlus className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <span className="font-medium text-foreground">Add manually</span>
              <p>Create contacts one by one with custom details</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

