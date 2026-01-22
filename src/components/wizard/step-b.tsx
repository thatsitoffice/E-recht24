'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Checkbox } from '../ui/Checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { SiteProfile } from '@prisma/client'

interface Props {
  profile: Partial<SiteProfile>
  onChange: (profile: Partial<SiteProfile>) => void
}

export function WizardStepB({ profile, onChange }: Props) {
  const updateField = (field: keyof SiteProfile, value: any) => {
    onChange({ ...profile, [field]: value })
  }

  const updateJsonField = (field: keyof SiteProfile, key: string, value: any) => {
    const current = (profile[field] as any) || {}
    onChange({ ...profile, [field]: { ...current, [key]: value } })
  }

  const updateBooleanField = (field: keyof SiteProfile, value: boolean) => {
    onChange({ ...profile, [field]: value })
  }

  const analytics = (profile.analytics as any) || {}
  const marketingPixels = (profile.marketingPixels as any) || {}
  const embeddedContent = (profile.embeddedContent as any) || {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datenschutz & Tracking</CardTitle>
        <CardDescription>
          Welche Tools und Services verwenden Sie auf Ihrer Website?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hostingProvider">Hosting-Provider</Label>
          <Input
            id="hostingProvider"
            placeholder="z.B. Vercel, AWS, Hetzner"
            value={profile.hostingProvider || ''}
            onChange={(e) => updateField('hostingProvider', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cms">CMS / Framework</Label>
          <Input
            id="cms"
            placeholder="z.B. WordPress, Next.js, Drupal"
            value={profile.cms || ''}
            onChange={(e) => updateField('cms', e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Label>Analytics</Label>
          <div className="space-y-2">
            <Select
              value={analytics.provider || ''}
              onValueChange={(value) => updateJsonField('analytics', 'provider', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Analytics-Tool wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GA4">Google Analytics 4</SelectItem>
                <SelectItem value="Matomo">Matomo</SelectItem>
                <SelectItem value="Plausible">Plausible</SelectItem>
                <SelectItem value="Keine">Keine</SelectItem>
              </SelectContent>
            </Select>
            {analytics.provider && analytics.provider !== 'Keine' && (
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="analyticsEnabled"
                  checked={analytics.enabled || false}
                  onCheckedChange={(checked) =>
                    updateJsonField('analytics', 'enabled', checked)
                  }
                />
                <Label htmlFor="analyticsEnabled" className="font-normal">
                  Analytics aktiviert
                </Label>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagManager">Tag-Management-System (optional)</Label>
          <Input
            id="tagManager"
            placeholder="z.B. Google Tag Manager"
            value={profile.tagManager || ''}
            onChange={(e) => updateField('tagManager', e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Label>Marketing-Pixels</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metaPixel"
                checked={marketingPixels.Meta || false}
                onCheckedChange={(checked) =>
                  updateJsonField('marketingPixels', 'Meta', checked)
                }
              />
              <Label htmlFor="metaPixel" className="font-normal">
                Meta (Facebook) Pixel
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tiktokPixel"
                checked={marketingPixels.TikTok || false}
                onCheckedChange={(checked) =>
                  updateJsonField('marketingPixels', 'TikTok', checked)
                }
              />
              <Label htmlFor="tiktokPixel" className="font-normal">
                TikTok Pixel
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="linkedinPixel"
                checked={marketingPixels.LinkedIn || false}
                onCheckedChange={(checked) =>
                  updateJsonField('marketingPixels', 'LinkedIn', checked)
                }
              />
              <Label htmlFor="linkedinPixel" className="font-normal">
                LinkedIn Pixel
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Eingebettete Inhalte</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="youtube"
                checked={embeddedContent.YouTube || false}
                onCheckedChange={(checked) =>
                  updateJsonField('embeddedContent', 'YouTube', checked)
                }
              />
              <Label htmlFor="youtube" className="font-normal">
                YouTube-Videos
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maps"
                checked={embeddedContent.Maps || false}
                onCheckedChange={(checked) =>
                  updateJsonField('embeddedContent', 'Maps', checked)
                }
              />
              <Label htmlFor="maps" className="font-normal">
                Google Maps
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vimeo"
                checked={embeddedContent.Vimeo || false}
                onCheckedChange={(checked) =>
                  updateJsonField('embeddedContent', 'Vimeo', checked)
                }
              />
              <Label htmlFor="vimeo" className="font-normal">
                Vimeo
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newsletterTool">Newsletter-Tool (optional)</Label>
          <Input
            id="newsletterTool"
            placeholder="z.B. Mailchimp, Sendinblue, CleverReach"
            value={profile.newsletterTool || ''}
            onChange={(e) => updateField('newsletterTool', e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Label>Weitere Funktionen</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contactForm"
                checked={profile.contactForm || false}
                onCheckedChange={(checked) =>
                  updateBooleanField('contactForm', checked as boolean)
                }
              />
              <Label htmlFor="contactForm" className="font-normal">
                Kontaktformular
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="userAccounts"
                checked={profile.userAccounts || false}
                onCheckedChange={(checked) =>
                  updateBooleanField('userAccounts', checked as boolean)
                }
              />
              <Label htmlFor="userAccounts" className="font-normal">
                Nutzerkonten / Registrierung
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="comments"
                checked={profile.comments || false}
                onCheckedChange={(checked) =>
                  updateBooleanField('comments', checked as boolean)
                }
              />
              <Label htmlFor="comments" className="font-normal">
                Kommentarfunktion
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recaptcha"
                checked={profile.recaptcha || false}
                onCheckedChange={(checked) =>
                  updateBooleanField('recaptcha', checked as boolean)
                }
              />
              <Label htmlFor="recaptcha" className="font-normal">
                reCAPTCHA / Cloudflare Turnstile
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
