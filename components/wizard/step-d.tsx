'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SiteProfile } from '@prisma/client'

interface Props {
  profile: Partial<SiteProfile>
  onChange: (profile: Partial<SiteProfile>) => void
  onGenerate: () => void
  isGenerating: boolean
}

export function WizardStepD({ profile, onChange, onGenerate, isGenerating }: Props) {
  const updateField = (field: keyof SiteProfile, value: any) => {
    onChange({ ...profile, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ausgabe-Optionen</CardTitle>
        <CardDescription>
          Wählen Sie die Einstellungen für die Dokumentgenerierung
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tone">Sprachstil</Label>
          <Select
            value={profile.tone || 'formal'}
            onValueChange={(value) => updateField('tone', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formell</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            value={profile.region || 'DE'}
            onValueChange={(value) => updateField('region', value)}
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

        <div className="space-y-2">
          <Label htmlFor="language">Sprache</Label>
          <Select
            value={profile.language || 'de'}
            onValueChange={(value) => updateField('language', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="en">English (coming soon)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Hinweis:</strong> Die generierten Texte sind Entwürfe und stellen keine
              Rechtsberatung dar. Bitte lassen Sie alle Texte von einem qualifizierten Rechtsanwalt prüfen.
            </p>
          </div>

          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generiere Dokument...' : 'Dokument jetzt generieren'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
