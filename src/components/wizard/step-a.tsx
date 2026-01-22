'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { SiteProfile } from '@prisma/client'

interface Props {
  profile: Partial<SiteProfile>
  onChange: (profile: Partial<SiteProfile>) => void
}

export function WizardStepA({ profile, onChange }: Props) {
  const updateField = (field: keyof SiteProfile, value: any) => {
    onChange({ ...profile, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website-Grundlagen</CardTitle>
        <CardDescription>
          Grundlegende Informationen zu Ihrer Website und Ihrem Unternehmen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain / Website-URL</Label>
          <Input
            id="domain"
            placeholder="example.com"
            value={profile.domain || ''}
            onChange={(e) => updateField('domain', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyType">Rechtsform</Label>
          <Select
            value={profile.companyType || ''}
            onValueChange={(value) => updateField('companyType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Rechtsform wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Einzelunternehmen">Einzelunternehmen</SelectItem>
              <SelectItem value="GbR">GbR (Gesellschaft bürgerlichen Rechts)</SelectItem>
              <SelectItem value="GmbH">GmbH</SelectItem>
              <SelectItem value="UG">UG (haftungsbeschränkt)</SelectItem>
              <SelectItem value="e.V.">e.V. (eingetragener Verein)</SelectItem>
              <SelectItem value="AG">AG (Aktiengesellschaft)</SelectItem>
              <SelectItem value="Sonstiges">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Firmenname</Label>
          <Input
            id="companyName"
            placeholder="Muster GmbH"
            value={profile.companyName || ''}
            onChange={(e) => updateField('companyName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="addressStreet">Straße & Hausnummer</Label>
            <Input
              id="addressStreet"
              placeholder="Musterstraße 123"
              value={profile.addressStreet || ''}
              onChange={(e) => updateField('addressStreet', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressZip">PLZ</Label>
            <Input
              id="addressZip"
              placeholder="10115"
              value={profile.addressZip || ''}
              onChange={(e) => updateField('addressZip', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressCity">Stadt</Label>
          <Input
            id="addressCity"
            placeholder="Berlin"
            value={profile.addressCity || ''}
            onChange={(e) => updateField('addressCity', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressCountry">Land</Label>
          <Select
            value={profile.addressCountry || 'DE'}
            onValueChange={(value) => updateField('addressCountry', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DE">Deutschland</SelectItem>
              <SelectItem value="AT">Österreich</SelectItem>
              <SelectItem value="CH">Schweiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">E-Mail</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="info@example.com"
              value={profile.contactEmail || ''}
              onChange={(e) => updateField('contactEmail', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Telefon (optional)</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="+49 30 12345678"
              value={profile.contactPhone || ''}
              onChange={(e) => updateField('contactPhone', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registerInfo">Handelsregister (optional)</Label>
          <Input
            id="registerInfo"
            placeholder="HRB 12345 B, Amtsgericht Berlin-Charlottenburg"
            value={profile.registerInfo || ''}
            onChange={(e) => updateField('registerInfo', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vatId">Umsatzsteuer-ID (optional)</Label>
          <Input
            id="vatId"
            placeholder="DE123456789"
            value={profile.vatId || ''}
            onChange={(e) => updateField('vatId', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsiblePerson">Verantwortlich für Inhalte (optional)</Label>
          <Input
            id="responsiblePerson"
            placeholder="Max Mustermann"
            value={profile.responsiblePerson || ''}
            onChange={(e) => updateField('responsiblePerson', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
