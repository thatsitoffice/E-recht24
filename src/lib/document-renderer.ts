import { GeneratedDocument } from './prompt-builder'

export class DocumentRenderer {
  /**
   * Renders a generated document as plain text
   */
  static renderText(document: GeneratedDocument): string {
    let text = `${document.title}\n`
    text += '='.repeat(document.title.length) + '\n\n'

    document.sections.forEach((section, index) => {
      text += `${section.heading}\n`
      text += '-'.repeat(section.heading.length) + '\n\n'
      text += `${section.body}\n\n`

      if (section.bullets && section.bullets.length > 0) {
        section.bullets.forEach(bullet => {
          text += `• ${bullet}\n`
        })
        text += '\n'
      }
    })

    if (document.warnings && document.warnings.length > 0) {
      text += '\n\nWARNUNGEN:\n'
      document.warnings.forEach(warning => {
        text += `⚠ ${warning}\n`
      })
    }

    return text.trim()
  }

  /**
   * Renders a generated document as HTML
   */
  static renderHTML(document: GeneratedDocument): string {
    let html = `<article class="legal-document">\n`
    html += `  <header>\n`
    html += `    <h1>${this.escapeHtml(document.title)}</h1>\n`
    html += `  </header>\n\n`

    document.sections.forEach((section) => {
      html += `  <section>\n`
      html += `    <h2>${this.escapeHtml(section.heading)}</h2>\n`
      html += `    <p>${this.formatParagraph(section.body)}</p>\n`

      if (section.bullets && section.bullets.length > 0) {
        html += `    <ul>\n`
        section.bullets.forEach(bullet => {
          html += `      <li>${this.escapeHtml(bullet)}</li>\n`
        })
        html += `    </ul>\n`
      }

      html += `  </section>\n\n`
    })

    if (document.warnings && document.warnings.length > 0) {
      html += `  <aside class="warnings">\n`
      html += `    <h3>Hinweise</h3>\n`
      html += `    <ul>\n`
      document.warnings.forEach(warning => {
        html += `      <li>${this.escapeHtml(warning)}</li>\n`
      })
      html += `    </ul>\n`
      html += `  </aside>\n`
    }

    html += `</article>`

    return html
  }

  /**
   * Renders a complete HTML page with the document
   */
  static renderHTMLPage(document: GeneratedDocument): string {
    const htmlContent = this.renderHTML(document)
    return `<!DOCTYPE html>
<html lang="${document.language || 'de'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(document.title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1 {
      border-bottom: 2px solid #333;
      padding-bottom: 0.5rem;
    }
    h2 {
      margin-top: 2rem;
      color: #555;
    }
    section {
      margin-bottom: 2rem;
    }
    ul {
      margin: 1rem 0;
      padding-left: 2rem;
    }
    .warnings {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 1rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  ${htmlContent}
  <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ddd; font-size: 0.9em; color: #666;">
    <p><strong>Hinweis:</strong> Dieser Text wurde automatisch generiert und stellt keine Rechtsberatung dar. Bitte lassen Sie die Texte von einem qualifizierten Rechtsanwalt prüfen.</p>
  </footer>
</body>
</html>`
  }

  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }

  private static formatParagraph(text: string): string {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\n+/)
    return paragraphs
      .map(p => this.escapeHtml(p.trim()))
      .filter(p => p.length > 0)
      .join('</p>\n    <p>')
  }
}
