import React from 'react'

export function sanitizeUrl(url?: string | null): string {
  if (!url) return '#'
  const trimmed = url.trim()

  // Disallow javascript:, data:, vbscript:, etc.
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#'
  }

  // Disallow protocol-relative URLs like "//attacker.com"
  if (trimmed.startsWith('//')) {
    return '#'
  }

  // Safe internal paths or anchor hashes
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed
  }

  // Allowed external protocols
  try {
    const parsed = new URL(trimmed, 'https://dummy-base.local')
    const protocol = parsed.protocol.toLowerCase()
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
      return trimmed
    }
  } catch {
    // Malformed URL
  }

  return '#'
}

export function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null

  // If content is a plain string
  if (typeof content === 'string') {
    return (
      <div className="rich-text-content" style={{ lineHeight: 1.75, fontSize: '1.05rem' }}>
        {renderSafeStringContent(content)}
      </div>
    )
  }

  // If content is Lexical JSON ({ root: { children: [...] } })
  if (content.root && Array.isArray(content.root.children)) {
    return (
      <div className="rich-text-content" style={{ lineHeight: 1.75, fontSize: '1.05rem' }}>
        {content.root.children.map((node: any, index: number) => renderLexicalNode(node, index))}
      </div>
    )
  }

  return null
}

function renderSafeStringContent(text: string): React.ReactNode {
  // If string contains basic HTML markup from WordPress migration, parse safely without dangerouslySetInnerHTML
  if (text.includes('<') && text.includes('>')) {
    return parseSimpleHtml(text)
  }

  // Otherwise split paragraphs and linebreaks safely
  const paragraphs = text.split(/\n\n+/)
  return paragraphs.map((para, pIdx) => {
    const lines = para.split(/\n/)
    return (
      <p key={pIdx} style={{ marginBottom: '1.25rem' }}>
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {line}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    )
  })
}

/**
 * Minimal, safe tokenizer for basic tags without dangerouslySetInnerHTML.
 * Drops script, iframe, styles, and dangerous event handlers.
 */
function parseSimpleHtml(html: string): React.ReactNode[] {
  // Strip out dangerous tags entirely
  const sanitizedHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')

  // Split into paragraphs by <p>...</p> or <br>
  const pRegex = /<p[^>]*>(.*?)<\/p>/gis
  const pMatches = [...sanitizedHtml.matchAll(pRegex)]

  if (pMatches.length > 0) {
    return pMatches.map((m, idx) => (
      <p key={idx} style={{ marginBottom: '1.25rem' }}>
        {renderInlineHtmlTokens(m[1])}
      </p>
    ))
  }

  // Fallback: render as single block with inline tokens
  return [<div key="root">{renderInlineHtmlTokens(sanitizedHtml)}</div>]
}

function renderInlineHtmlTokens(raw: string): React.ReactNode {
  // Replace <br> or <br/> with unique token
  const tokens = raw.split(/(<br\s*\/?>|<a\b[^>]*>.*?<\/a>|<strong>.*?<\/strong>|<b>.*?<\/b>|<em>.*?<\/em>|<i>.*?<\/i>)/gi)

  return tokens.map((token, idx) => {
    if (!token) return null
    if (/^<br\s*\/?>$/i.test(token)) {
      return <br key={idx} />
    }

    const aMatch = token.match(/^<a\b([^>]*)>(.*?)<\/a>$/i)
    if (aMatch) {
      const hrefMatch = aMatch[1].match(/href=["']([^"']+)["']/i)
      const safeHref = sanitizeUrl(hrefMatch ? hrefMatch[1] : '')
      const targetMatch = aMatch[1].match(/target=["']([^"']+)["']/i)
      const isBlank = targetMatch && targetMatch[1] === '_blank'
      return (
        <a
          key={idx}
          href={safeHref}
          target={isBlank ? '_blank' : undefined}
          rel={isBlank ? 'noopener noreferrer' : undefined}
        >
          {aMatch[2].replace(/<[^>]+>/g, '')}
        </a>
      )
    }

    const strongMatch = token.match(/^<(strong|b)>(.*?)<\/(strong|b)>$/i)
    if (strongMatch) {
      return <strong key={idx}>{strongMatch[2].replace(/<[^>]+>/g, '')}</strong>
    }

    const emMatch = token.match(/^<(em|i)>(.*?)<\/(em|i)>$/i)
    if (emMatch) {
      return <em key={idx}>{emMatch[2].replace(/<[^>]+>/g, '')}</em>
    }

    // Strip any remaining stray tags
    return <React.Fragment key={idx}>{token.replace(/<[^>]+>/g, '')}</React.Fragment>
  })
}

function renderLexicalNode(node: any, key: number): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} style={{ marginBottom: '1.25rem' }}>
          {node.children?.map((child: any, i: number) => renderLexicalChild(child, i))}
        </p>
      )

    case 'heading': {
      const tag = node.tag || 'h2'
      const HeadingTag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? tag : 'h2') as
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
      return (
        <HeadingTag key={key} style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>
          {node.children?.map((child: any, i: number) => renderLexicalChild(child, i))}
        </HeadingTag>
      )
    }

    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <ListTag key={key} style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
          {node.children?.map((child: any, i: number) => {
            if (child.type === 'listitem') {
              return (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  {child.children?.map((itemChild: any, j: number) => renderLexicalChild(itemChild, j))}
                </li>
              )
            }
            return renderLexicalNode(child, i)
          })}
        </ListTag>
      )
    }

    case 'listitem':
      return (
        <li key={key} style={{ marginBottom: '0.5rem' }}>
          {node.children?.map((child: any, i: number) => renderLexicalChild(child, i))}
        </li>
      )

    case 'quote':
      return (
        <blockquote
          key={key}
          style={{
            borderLeft: '4px solid var(--color-primary)',
            paddingLeft: '1.25rem',
            margin: '1.5rem 0',
            fontStyle: 'italic',
            color: 'var(--color-muted)',
            background: 'var(--color-surface)',
            padding: '1rem 1.25rem',
            borderRadius: '0 0.5rem 0.5rem 0',
          }}
        >
          {node.children?.map((child: any, i: number) => renderLexicalChild(child, i))}
        </blockquote>
      )

    case 'table':
      return (
        <div key={key} className="table-responsive" style={{ margin: '1.5rem 0' }}>
          <table className="data-table">
            <tbody>
              {node.children?.map((row: any, rIdx: number) => renderLexicalNode(row, rIdx))}
            </tbody>
          </table>
        </div>
      )

    case 'tablerow':
      return (
        <tr key={key}>
          {node.children?.map((cell: any, cIdx: number) => renderLexicalNode(cell, cIdx))}
        </tr>
      )

    case 'tablecell': {
      const isHeader = Boolean(node.headerState || node.isHeader)
      const CellTag = isHeader ? 'th' : 'td'
      return (
        <CellTag key={key} colSpan={node.colSpan || 1} rowSpan={node.rowSpan || 1}>
          {node.children?.map((child: any, i: number) => renderLexicalChild(child, i))}
        </CellTag>
      )
    }

    case 'code':
      return (
        <pre key={key}>
          <code>
            {node.children?.map((child: any, i: number) => renderLexicalChild(child, i))}
          </code>
        </pre>
      )

    case 'upload': {
      const media = node.value
      if (!media || !media.url) return null
      const safeSrc = sanitizeUrl(media.url)
      return (
        <figure key={key} style={{ margin: '2rem 0' }}>
          <img
            src={safeSrc}
            alt={media.alt || ''}
            loading="lazy"
            style={{ borderRadius: 'var(--radius-card)', width: '100%', maxHeight: '500px', objectFit: 'cover' }}
          />
          {media.caption && (
            <figcaption
              style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.5rem', textAlign: 'center' }}
            >
              {typeof media.caption === 'string' ? media.caption : ''}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'horizontalrule':
      return <hr key={key} style={{ margin: '2rem 0', border: 0, borderTop: '1px solid var(--color-border)' }} />

    case 'linebreak':
      return <br key={key} />

    default:
      if (node.children) {
        return (
          <div key={key}>
            {node.children.map((child: any, i: number) => renderLexicalNode(child, i))}
          </div>
        )
      }
      return null
  }
}

function renderLexicalChild(node: any, key: number): React.ReactNode {
  if (!node) return null

  // Nested list inside a listitem or block
  if (node.type === 'list') {
    return renderLexicalNode(node, key)
  }

  // Linebreak node
  if (node.type === 'linebreak') {
    return <br key={key} />
  }

  // Link or Autolink
  if (node.type === 'link' || node.type === 'autolink') {
    const rawUrl = node.fields?.url || node.url || ''
    const safeUrl = sanitizeUrl(rawUrl)
    const isNewTab = Boolean(node.fields?.newTab || node.newTab)

    return (
      <a
        key={key}
        href={safeUrl}
        target={isNewTab ? '_blank' : undefined}
        rel={isNewTab ? 'noopener noreferrer' : undefined}
      >
        {node.children?.map((child: any, i: number) => renderLexicalChild(child, i))}
      </a>
    )
  }

  // Text node
  let text = node.text || ''
  if (!text) return null

  // Format flags: 1 = Bold, 2 = Italic, 4 = Strikethrough, 8 = Underline, 16 = Code, 32 = Subscript, 64 = Superscript
  let formatted: React.ReactNode = text
  const format = Number(node.format || 0)

  if (format & 1) formatted = <strong>{formatted}</strong>
  if (format & 2) formatted = <em>{formatted}</em>
  if (format & 4) formatted = <s>{formatted}</s>
  if (format & 8) formatted = <u>{formatted}</u>
  if (format & 16) formatted = <code>{formatted}</code>
  if (format & 32) formatted = <sub>{formatted}</sub>
  if (format & 64) formatted = <sup>{formatted}</sup>

  return <React.Fragment key={key}>{formatted}</React.Fragment>
}
