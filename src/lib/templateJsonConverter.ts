// Converter for structured JSON template format (dom/css/js) ↔ HTML string

// --- Types for the structured JSON format ---

export interface DomNode {
  type: 'element' | 'text';
  tag?: string;
  attributes?: Record<string, string>;
  children?: DomNode[];
  content?: string; // for text nodes
}

export interface CssRule {
  selector: string;
  declarations: Record<string, string>;
  order: number;
}

export interface CssData {
  rules: CssRule[];
  variables?: Record<string, string>;
  animations?: Array<{ name: string; keyframes: string }>;
}

export interface JsData {
  code: string;
}

export interface StructuredTemplate {
  dom: DomNode;
  css: CssData;
  js: JsData;
}

// --- JSON DOM → HTML string ---

function domNodeToHtml(node: DomNode): string {
  if (node.type === 'text') {
    return node.content || '';
  }

  const tag = node.tag || 'div';
  const voidTags = ['meta', 'link', 'br', 'hr', 'img', 'input', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];

  let attrs = '';
  if (node.attributes) {
    attrs = Object.entries(node.attributes)
      .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
      .join('');
  }

  if (voidTags.includes(tag)) {
    return `<${tag}${attrs}>`;
  }

  const children = (node.children || []).map(domNodeToHtml).join('');
  return `<${tag}${attrs}>${children}</${tag}>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// --- CSS rules → CSS string ---

function cssDataToString(css: CssData): string {
  const parts: string[] = [];

  // CSS variables
  if (css.variables && Object.keys(css.variables).length > 0) {
    const vars = Object.entries(css.variables)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
    parts.push(`:root {\n${vars}\n}`);
  }

  // Animations
  if (css.animations) {
    css.animations.forEach(anim => {
      parts.push(`@keyframes ${anim.name} {\n${anim.keyframes}\n}`);
    });
  }

  // Rules sorted by order
  const sorted = [...css.rules].sort((a, b) => a.order - b.order);
  sorted.forEach(rule => {
    const decls = Object.entries(rule.declarations)
      .map(([prop, val]) => `  ${prop}: ${val};`)
      .join('\n');
    parts.push(`${rule.selector} {\n${decls}\n}`);
  });

  return parts.join('\n\n');
}

// --- Build full HTML from structured JSON ---

export function structuredToHtml(data: StructuredTemplate): string {
  // Clone the DOM tree to inject CSS/JS into it
  const domCopy = JSON.parse(JSON.stringify(data.dom)) as DomNode;

  // Find or create <head>
  let headNode = domCopy.children?.find(c => c.tag === 'head');
  if (!headNode) {
    headNode = { type: 'element', tag: 'head', attributes: {}, children: [] };
    domCopy.children = domCopy.children || [];
    domCopy.children.unshift(headNode);
  }

  // Remove external stylesheet <link> tags (we inline the CSS)
  if (headNode.children) {
    headNode.children = headNode.children.filter(c => {
      if (c.tag === 'link' && c.attributes?.rel === 'stylesheet') return false;
      return true;
    });
  }

  // Add inline <style> with all CSS
  const cssString = cssDataToString(data.css);
  if (cssString) {
    headNode.children = headNode.children || [];
    headNode.children.push({
      type: 'element',
      tag: 'style',
      attributes: {},
      children: [{ type: 'text', content: cssString }],
    });
  }

  // Find or create <body>
  let bodyNode = domCopy.children?.find(c => c.tag === 'body');
  if (!bodyNode) {
    bodyNode = { type: 'element', tag: 'body', attributes: {}, children: [] };
    domCopy.children = domCopy.children || [];
    domCopy.children.push(bodyNode);
  }

  // Add inline <script> with all JS
  if (data.js?.code?.trim()) {
    bodyNode.children = bodyNode.children || [];
    bodyNode.children.push({
      type: 'element',
      tag: 'script',
      attributes: {},
      children: [{ type: 'text', content: data.js.code }],
    });
  }

  return '<!DOCTYPE html>\n' + domNodeToHtml(domCopy);
}

// --- Parse HTML string back to structured JSON ---

export function htmlToStructured(htmlString: string): StructuredTemplate {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Extract CSS from all <style> tags
  const rules: CssRule[] = [];
  const styleEls = doc.querySelectorAll('style');
  let ruleOrder = 0;

  styleEls.forEach(styleEl => {
    const text = styleEl.textContent || '';
    // Parse CSS rules using a simple regex-based approach
    const parsed = parseCssRules(text);
    parsed.forEach(r => {
      rules.push({ ...r, order: ruleOrder++ });
    });
    styleEl.remove();
  });

  // Extract JS from all <script> tags (non-src)
  let jsCode = '';
  const scriptEls = doc.querySelectorAll('script:not([src])');
  scriptEls.forEach(scriptEl => {
    jsCode += (scriptEl.textContent || '') + '\n';
    scriptEl.remove();
  });

  // Convert DOM to JSON tree
  const dom = elementToDomNode(doc.documentElement);

  return {
    dom,
    css: { rules, variables: {}, animations: [] },
    js: { code: jsCode.trim() },
  };
}

function elementToDomNode(el: Element): DomNode {
  const node: DomNode = {
    type: 'element',
    tag: el.tagName.toLowerCase(),
    attributes: {},
    children: [],
  };

  // Collect attributes
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    node.attributes![attr.name] = attr.value;
  }

  // Process children
  el.childNodes.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      node.children!.push(elementToDomNode(child as Element));
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent || '';
      if (text.trim()) {
        node.children!.push({ type: 'text', content: text });
      }
    }
  });

  return node;
}

// Simple CSS rule parser
function parseCssRules(cssText: string): Array<{ selector: string; declarations: Record<string, string> }> {
  const results: Array<{ selector: string; declarations: Record<string, string> }> = [];

  // Remove comments
  const cleaned = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  // Skip @keyframes and @media blocks for now (keep them as-is)
  // Match top-level rules: selector { declarations }
  const ruleRegex = /([^{}@]+)\{([^{}]*)\}/g;
  let match;

  while ((match = ruleRegex.exec(cleaned)) !== null) {
    const selector = match[1].trim();
    const declBlock = match[2].trim();

    if (!selector || selector.startsWith('@')) continue;

    const declarations: Record<string, string> = {};
    declBlock.split(';').forEach(decl => {
      const colonIdx = decl.indexOf(':');
      if (colonIdx > 0) {
        const prop = decl.substring(0, colonIdx).trim();
        const val = decl.substring(colonIdx + 1).trim();
        if (prop && val) {
          declarations[prop] = val;
        }
      }
    });

    if (Object.keys(declarations).length > 0) {
      results.push({ selector, declarations });
    }
  }

  return results;
}

// --- Utility: Update a specific CSS rule's declaration ---

export function updateCssRule(
  css: CssData,
  selector: string,
  property: string,
  value: string
): CssData {
  const rules = [...css.rules];
  const existing = rules.find(r => r.selector === selector);
  if (existing) {
    existing.declarations = { ...existing.declarations, [property]: value };
  } else {
    rules.push({
      selector,
      declarations: { [property]: value },
      order: rules.length,
    });
  }
  return { ...css, rules };
}

// --- Utility: Update a DOM node's attribute by finding it ---

export function updateDomAttribute(
  dom: DomNode,
  predicate: (node: DomNode) => boolean,
  attrKey: string,
  attrValue: string
): DomNode {
  if (predicate(dom)) {
    return {
      ...dom,
      attributes: { ...(dom.attributes || {}), [attrKey]: attrValue },
    };
  }
  if (dom.children) {
    return {
      ...dom,
      children: dom.children.map(c => updateDomAttribute(c, predicate, attrKey, attrValue)),
    };
  }
  return dom;
}

// --- Utility: Check if data is structured JSON format ---

export function isStructuredTemplate(data: unknown): data is StructuredTemplate {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    obj.dom !== undefined &&
    typeof obj.dom === 'object' &&
    obj.css !== undefined &&
    typeof obj.css === 'object'
  );
}
