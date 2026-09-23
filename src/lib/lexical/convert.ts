/**
 * Utilities to convert between plain text / markdown and Lexical JSON format.
 */

export function textToLexical(rawText: string): any {
  if (!rawText || !rawText.trim()) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [],
            direction: 'ltr',
          },
        ],
        direction: 'ltr',
      },
    }
  }

  const blocks = rawText.split(/\n\n+/)
  const children: any[] = []

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue

    // Heading ##
    if (trimmed.startsWith('### ')) {
      children.push({
        type: 'heading',
        tag: 'h3',
        format: '',
        indent: 0,
        version: 1,
        children: [{ mode: 'normal', text: trimmed.slice(4), type: 'text', format: 0, version: 1 }],
        direction: 'ltr',
      })
    } else if (trimmed.startsWith('## ')) {
      children.push({
        type: 'heading',
        tag: 'h2',
        format: '',
        indent: 0,
        version: 1,
        children: [{ mode: 'normal', text: trimmed.slice(3), type: 'text', format: 0, version: 1 }],
        direction: 'ltr',
      })
    } else if (trimmed.startsWith('# ')) {
      children.push({
        type: 'heading',
        tag: 'h1',
        format: '',
        indent: 0,
        version: 1,
        children: [{ mode: 'normal', text: trimmed.slice(2), type: 'text', format: 0, version: 1 }],
        direction: 'ltr',
      })
    } else if (trimmed.startsWith('> ')) {
      children.push({
        type: 'quote',
        format: '',
        indent: 0,
        version: 1,
        children: [{ mode: 'normal', text: trimmed.slice(2), type: 'text', format: 0, version: 1 }],
        direction: 'ltr',
      })
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Unordered list
      const items = trimmed.split('\n')
      const listItems = items.map((line) => {
        const itemText = line.replace(/^[-*]\s+/, '')
        return {
          type: 'listitem',
          format: '',
          indent: 0,
          version: 1,
          children: [{ mode: 'normal', text: itemText, type: 'text', format: 0, version: 1 }],
          direction: 'ltr',
        }
      })
      children.push({
        type: 'list',
        listType: 'bullet',
        format: '',
        indent: 0,
        version: 1,
        children: listItems,
        direction: 'ltr',
      })
    } else {
      // Standard paragraph
      children.push({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{ mode: 'normal', text: trimmed, type: 'text', format: 0, version: 1 }],
        direction: 'ltr',
      })
    }
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: children.length > 0 ? children : [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [],
          direction: 'ltr',
        },
      ],
      direction: 'ltr',
    },
  }
}

export function lexicalToText(lexical: any): string {
  if (!lexical) return ''
  if (typeof lexical === 'string') return lexical

  if (!lexical.root || !Array.isArray(lexical.root.children)) {
    return ''
  }

  const parts: string[] = []

  for (const node of lexical.root.children) {
    if (!node) continue

    if (node.type === 'heading') {
      const prefix = node.tag === 'h1' ? '# ' : node.tag === 'h3' ? '### ' : '## '
      const text = extractTextFromChildren(node.children)
      parts.push(`${prefix}${text}`)
    } else if (node.type === 'quote') {
      const text = extractTextFromChildren(node.children)
      parts.push(`> ${text}`)
    } else if (node.type === 'list') {
      const items = (node.children || [])
        .map((li: any) => `- ${extractTextFromChildren(li.children)}`)
        .join('\n')
      parts.push(items)
    } else if (node.type === 'paragraph') {
      const text = extractTextFromChildren(node.children)
      parts.push(text)
    } else {
      const text = extractTextFromChildren(node.children)
      if (text) parts.push(text)
    }
  }

  return parts.join('\n\n')
}

function extractTextFromChildren(children?: any[]): string {
  if (!Array.isArray(children)) return ''
  return children
    .map((c) => {
      if (c.text) return c.text
      if (c.children) return extractTextFromChildren(c.children)
      return ''
    })
    .join('')
}
