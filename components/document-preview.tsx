'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Copy, Check } from 'lucide-react'

interface Document {
  id: string
  type: string
  title: string
  htmlContent?: string
  textContent?: string
  content: any
}

interface Props {
  document: Document
}

export function DocumentPreview({ document }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (content: string, extension: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = `${document.title.toLowerCase().replace(/\s+/g, '-')}.${extension}`
    window.document.body.appendChild(a)
    a.click()
    window.document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{document.title}</CardTitle>
            <CardDescription>
              Generiert am {new Date(document.content?.createdAt || Date.now()).toLocaleDateString('de-DE')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {document.htmlContent && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(document.htmlContent!)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  HTML kopieren
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(document.htmlContent!, 'html')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  HTML
                </Button>
              </>
            )}
            {document.textContent && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(document.textContent!)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Text kopieren
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(document.textContent!, 'txt')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  TXT
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="html" className="w-full">
          <TabsList>
            {document.htmlContent && <TabsTrigger value="html">HTML</TabsTrigger>}
            {document.textContent && <TabsTrigger value="text">Text</TabsTrigger>}
            <TabsTrigger value="raw">Rohdaten</TabsTrigger>
          </TabsList>
          {document.htmlContent && (
            <TabsContent value="html" className="mt-4">
              <div className="border rounded-lg p-4 bg-background max-h-[600px] overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: document.htmlContent }} />
              </div>
            </TabsContent>
          )}
          {document.textContent && (
            <TabsContent value="text" className="mt-4">
              <div className="border rounded-lg p-4 bg-background max-h-[600px] overflow-auto whitespace-pre-wrap font-mono text-sm">
                {document.textContent}
              </div>
            </TabsContent>
          )}
          <TabsContent value="raw" className="mt-4">
            <div className="border rounded-lg p-4 bg-background max-h-[600px] overflow-auto">
              <pre className="text-xs">{JSON.stringify(document.content, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>

        {document.content?.warnings && document.content.warnings.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Warnungen:</h4>
            <ul className="list-disc list-inside text-sm text-yellow-800">
              {document.content.warnings.map((warning: string, idx: number) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
