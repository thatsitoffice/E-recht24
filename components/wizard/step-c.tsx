'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SiteProfile } from '@prisma/client'

interface Props {
  profile: Partial<SiteProfile>
  onChange: (profile: Partial<SiteProfile>) => void
}

export function WizardStepC({ profile, onChange }: Props) {
  const updateField = (field: keyof SiteProfile, value: any) => {
    onChange({ ...profile, [field]: value })
  }

  const updateJsonField = (field: keyof SiteProfile, key: string, value: any) => {
    const current = (profile[field] as any) || {}
    onChange({ ...profile, [field]: { ...current, [key]: value } })
  }

  const cookieCategories = (profile.cookieCategories as any) || {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookies & Einwilligung</CardTitle>
        <CardDescription>
          Cookie-Einstellungen und Consent-Management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="setsCookies"
              checked={profile.setsCookies || false}
              onCheckedChange={(checked) =>
                updateField('setsCookies', checked)
              }
            />
            <Label htmlFor="setsCookies" className="font-normal">
              Meine Website setzt Cookies
            </Label>
          </div>
        </div>

        {profile.setsCookies && (
          <>
            <div className="space-y-4">
              <Label>Cookie-Kategorien</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="essentialCookies"
                    checked={cookieCategories.essential || false}
                    onCheckedChange={(checked) =>
                      updateJsonField('cookieCategories', 'essential', checked)
                    }
                  />
                  <Label htmlFor="essentialCookies" className="font-normal">
                    Notwendige Cookies (immer aktiv)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="statisticsCookies"
                    checked={cookieCategories.statistics || false}
                    onCheckedChange={(checked) =>
                      updateJsonField('cookieCategories', 'statistics', checked)
                    }
                  />
                  <Label htmlFor="statisticsCookies" className="font-normal">
                    Statistik-Cookies
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketingCookies"
                    checked={cookieCategories.marketing || false}
                    onCheckedChange={(checked) =>
                      updateJsonField('cookieCategories', 'marketing', checked)
                    }
                  />
                  <Label htmlFor="marketingCookies" className="font-normal">
                    Marketing-Cookies
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consentMode">Einwilligungsmodus</Label>
              <Select
                value={profile.consentMode || ''}
                onValueChange={(value) => updateField('consentMode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Modus wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opt-in">Opt-In (Standard, DSGVO-konform)</SelectItem>
                  <SelectItem value="opt-out">Opt-Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cmpProvider">Cookie-Consent-Tool (optional)</Label>
              <Select
                value={profile.cmpProvider || ''}
                onValueChange={(value) => updateField('cmpProvider', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tool wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Keine">Keine / Eigenes Tool</SelectItem>
                  <SelectItem value="Cookiebot">Cookiebot</SelectItem>
                  <SelectItem value="OneTrust">OneTrust</SelectItem>
                  <SelectItem value="Osano">Osano</SelectItem>
                  <SelectItem value="Borlabs">Borlabs Cookie</SelectItem>
                  <SelectItem value="Real Cookie Banner">Real Cookie Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
