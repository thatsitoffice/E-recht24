'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { WizardStepA } from '@/components/wizard/step-a'
import { WizardStepB } from '@/components/wizard/step-b'
import { WizardStepC } from '@/components/wizard/step-c'
import { WizardStepD } from '@/components/wizard/step-d'
import { DocumentPreview } from '@/components/document-preview'
import { AuthButton } from '@/components/auth-button'
import { SiteProfile } from '@prisma/client'

type WizardStep = 'a' | 'b' | 'c' | 'd' | 'preview'

export default function GeneratorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const documentType = searchParams.get('type') || 'impressum'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/generator?type=' + documentType))
    }
  }, [status, router, documentType])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Lädt...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const [currentStep, setCurrentStep] = useState<WizardStep>('a')
  const [siteProfile, setSiteProfile] = useState<Partial<SiteProfile>>({})
  const [siteProfileId, setSiteProfileId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState<any>(null)

  const steps = [
    { id: 'a', label: 'Website-Grundlagen' },
    { id: 'b', label: 'Datenschutz' },
    { id: 'c', label: 'Cookies & Einwilligung' },
    { id: 'd', label: 'Ausgabe-Optionen' },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep === 'a') setCurrentStep('b')
    else if (currentStep === 'b') setCurrentStep('c')
    else if (currentStep === 'c') setCurrentStep('d')
    else if (currentStep === 'd') setCurrentStep('preview')
  }

  const handleBack = () => {
    if (currentStep === 'b') setCurrentStep('a')
    else if (currentStep === 'c') setCurrentStep('b')
    else if (currentStep === 'd') setCurrentStep('c')
    else if (currentStep === 'preview') setCurrentStep('d')
  }

  const handleSaveProfile = async () => {
    try {
      if (siteProfileId) {
        const response = await fetch(`/api/site-profiles/${siteProfileId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteProfile),
        })
        const data = await response.json()
        if (data.success && data.siteProfile) {
          setSiteProfileId(data.siteProfile.id)
        }
      } else {
        const response = await fetch('/api/site-profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteProfile),
        })
        const data = await response.json()
        if (data.success && data.siteProfile) {
          setSiteProfileId(data.siteProfile.id)
        }
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Save profile first
      if (!siteProfileId) {
        await handleSaveProfile()
      }

      const profileId = siteProfileId || (await fetch('/api/site-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteProfile),
      }).then(r => r.json()).then(d => d.siteProfile?.id))

      if (!profileId) {
        throw new Error('Failed to create site profile')
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteProfileId: profileId,
          documentType,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedDocument(data.document)
        setCurrentStep('preview')
      } else {
        alert('Fehler beim Generieren: ' + (data.error || 'Unbekannter Fehler'))
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      alert('Fehler beim Generieren: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Generator</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Abbrechen
            </Button>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              {documentType === 'impressum' && 'Impressum'}
              {documentType === 'datenschutz' && 'Datenschutzerklärung'}
              {documentType === 'cookie_policy' && 'Cookie-Richtlinie'}
            </h2>
            <div className="text-sm text-muted-foreground">
              Schritt {currentStepIndex + 1} von {steps.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {currentStep === 'a' && (
              <WizardStepA
                profile={siteProfile}
                onChange={setSiteProfile}
              />
            )}
            {currentStep === 'b' && (
              <WizardStepB
                profile={siteProfile}
                onChange={setSiteProfile}
              />
            )}
            {currentStep === 'c' && (
              <WizardStepC
                profile={siteProfile}
                onChange={setSiteProfile}
              />
            )}
            {currentStep === 'd' && (
              <WizardStepD
                profile={siteProfile}
                onChange={setSiteProfile}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
            {currentStep === 'preview' && generatedDocument && (
              <DocumentPreview document={generatedDocument} />
            )}

            {currentStep !== 'preview' && (
              <div className="flex gap-4 mt-6">
                {currentStep !== 'a' && (
                  <Button variant="outline" onClick={handleBack}>
                    Zurück
                  </Button>
                )}
                {currentStep !== 'd' ? (
                  <Button onClick={handleNext} className="ml-auto">
                    Weiter
                  </Button>
                ) : (
                  <Button onClick={handleGenerate} disabled={isGenerating} className="ml-auto">
                    {isGenerating ? 'Generiere...' : 'Dokument generieren'}
                  </Button>
                )}
              </div>
            )}
          </div>

          {currentStep !== 'preview' && (
            <div className="hidden lg:block">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Vorschau</CardTitle>
                  <CardDescription>
                    Ihre Eingaben werden hier angezeigt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Typ:</strong> {documentType}</p>
                    {siteProfile.companyName && (
                      <p><strong>Firma:</strong> {siteProfile.companyName}</p>
                    )}
                    {siteProfile.domain && (
                      <p><strong>Domain:</strong> {siteProfile.domain}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
