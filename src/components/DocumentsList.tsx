'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { FileText, Calendar } from 'lucide-react';

interface Document {
  id: string;
  type: string;
  title: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDocuments(data.documents);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'impressum':
        return 'Impressum';
      case 'datenschutz':
        return 'Datenschutzerklärung';
      case 'cookie_policy':
        return 'Cookie-Richtlinie';
      case 'cookie_consent':
        return 'Cookie-Einwilligung';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meine Dokumente</h1>
          <div className="flex gap-2">
            <a href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </a>
            <a href="/generator">
              <Button>Neues Dokument</Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">Lade Dokumente...</div>
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Noch keine Dokumente</h3>
              <p className="text-muted-foreground mb-4">
                Erstellen Sie Ihr erstes Dokument mit dem Generator.
              </p>
              <a href="/dashboard">
                <Button>Zum Generator</Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                  </div>
                  <CardDescription>{getDocumentTypeLabel(doc.type)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(doc.createdAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Anzeigen
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Duplizieren
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
