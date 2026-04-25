import { templateStorage, type Template } from './storage';
import { structuredToHtml, type StructuredTemplate } from './templateJsonConverter';

// The exact structured JSON format from the backend
const dummyStructuredData: StructuredTemplate = {
  dom: {
    type: 'element',
    tag: 'html',
    attributes: { lang: 'en' },
    children: [
      {
        type: 'element',
        tag: 'head',
        attributes: {},
        children: [
          { type: 'element', tag: 'meta', attributes: { charset: 'UTF-8' }, children: [] },
          { type: 'element', tag: 'meta', attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, children: [] },
          { type: 'element', tag: 'title', attributes: {}, children: [{ type: 'text', content: 'Test Page' }] },
          { type: 'element', tag: 'link', attributes: { rel: 'stylesheet', href: 'styles.css' }, children: [] },
        ],
      },
      {
        type: 'element',
        tag: 'body',
        attributes: {},
        children: [
          {
            type: 'element',
            tag: 'div',
            attributes: { class: 'main-container' },
            children: [
              {
                type: 'element',
                tag: 'h1',
                attributes: { style: 'color:rgb(2, 48, 139); font-weight: bold;' },
                children: [{ type: 'text', content: 'Up - Down' }],
              },
              {
                type: 'element',
                tag: 'div',
                attributes: { class: 'container' },
                children: [
                  {
                    type: 'element',
                    tag: 'h2',
                    attributes: { id: 'number', 'data-value': '0', style: 'color: rgb(0, 0, 154);' },
                    children: [{ type: 'text', content: '0' }],
                  },
                  {
                    type: 'element',
                    tag: 'div',
                    attributes: { id: 'buttons-container' },
                    children: [
                      { type: 'element', tag: 'button', attributes: { id: 'increase' }, children: [{ type: 'text', content: 'Increase' }] },
                      { type: 'element', tag: 'button', attributes: { id: 'reset' }, children: [{ type: 'text', content: 'Reset' }] },
                      { type: 'element', tag: 'button', attributes: { id: 'decrease' }, children: [{ type: 'text', content: 'Decrease' }] },
                    ],
                  },
                ],
              },
              { type: 'element', tag: 'span', attributes: { id: 'clock' }, children: [] },
            ],
          },
        ],
      },
    ],
  },
  css: {
    rules: [
      { selector: 'body', declarations: { margin: '0', padding: '0', display: 'flex', width: '100%', height: '100vh', 'justify-content': 'center', 'align-items': 'center', 'background-size': 'cover', 'background-color': 'rgb(228, 228, 253)' }, order: 0 },
      { selector: '.main-container', declarations: { position: 'relative', display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'flex-start', height: '60vh', width: '50%', 'background-color': 'rgba(0, 0, 255, 0.15)', 'border-radius': '16px', 'backdrop-filter': 'blur(10px)', border: '1px solid rgba(0, 125, 255, 0.3)', 'box-shadow': '10px 10px 20px rgba(0, 0, 255, 0.15)' }, order: 1 },
      { selector: '*', declarations: { margin: '0', padding: '0', 'box-sizing': 'border-box' }, order: 2 },
      { selector: 'body', declarations: { 'font-family': '"monospace", sans-serif', background: '#f5f5f5' }, order: 3 },
      { selector: '.container', declarations: { position: 'relative', 'max-width': '400px', margin: '50px auto', padding: '20px', background: 'rgba(255, 255, 255, 0.7)', 'backdrop-filter': 'blur(10px)', 'border-radius': '10px', 'box-shadow': '0 0 10px rgba(0,0,0,0.1)', display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'margin-top': '50px', border: '2px solid rgba(0,0,0,0.1)' }, order: 4 },
      { selector: 'h1', declarations: { 'margin-top': '20px', 'font-size': '3rem' }, order: 5 },
      { selector: 'button', declarations: { padding: '10px 20px', color: '#fff', border: 'none', 'border-radius': '30px', cursor: 'pointer', transition: 'all 0.3s ease' }, order: 6 },
      { selector: '#buttons-container', declarations: { display: 'flex', gap: '10px', 'margin-top': '40px' }, order: 7 },
      { selector: '#increase', declarations: { background: 'rgba(76, 175, 80, 0.1)', border: '2px solid #4CAF50', color: '#4CAF50' }, order: 8 },
      { selector: '#reset', declarations: { background: 'none', border: '2px solid #696969', color: '#696969' }, order: 9 },
      { selector: '#decrease', declarations: { background: 'none', border: '2px solid #f44336', color: '#f44336' }, order: 10 },
      { selector: '#increase:hover', declarations: { transform: 'scale(1.1) translate(0, -8px)', 'box-shadow': '0 0 10px rgba(76, 175, 80, 0.5)' }, order: 11 },
      { selector: '#reset:hover', declarations: { transform: 'scale(1.1) translate(0, -8px)', 'box-shadow': '0 0 10px rgba(105, 105, 105, 0.5)' }, order: 12 },
      { selector: '#decrease:hover', declarations: { transform: 'scale(1.1) translate(0, -8px)', 'box-shadow': '0 0 10px rgba(244, 67, 54, 0.5)' }, order: 13 },
      { selector: '#clock', declarations: { position: 'absolute', color: '#002e9a', padding: '3px', 'border-radius': '50%', animation: 'pulse 1s infinite', 'background-color': 'rgba(233, 234, 255, 0.7)', display: 'flex', 'align-items': 'center', 'justify-content': 'center', border: '1px solid white', 'backdrop-filter': 'blur(5px)', left: '15px', top: '15px' }, order: 14 },
    ],
    variables: {},
    animations: [],
  },
  js: {
    code: `
    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
    });

document.addEventListener('DOMContentLoaded', function() {
    const clock = document.getElementById("clock");
    const increase_button = document.getElementById("increase");
    const reset_button = document.getElementById("reset");
    const decrease_button = document.getElementById("decrease");
    let time = 0;
    clock.textContent = String(time) + "s";
    let number = document.getElementById("number");
    increase_button.addEventListener("click", function() {
        console.log("Increase button clicked");
        number.textContent = parseInt(number.textContent) + 1;
        number.dataset.value = number.textContent;
    });
    reset_button.addEventListener("click", function() {
        console.log("Reset button clicked");
        number.textContent = 0;
        number.dataset.value = number.textContent;
    });
    decrease_button.addEventListener("click", function() {
        console.log("Decrease button clicked");
        number.textContent = parseInt(number.textContent) - 1;
        number.dataset.value = number.textContent;
    });
    function updateClock() {
        time++;
        clock.textContent = String(time) + "s";
    }
    setInterval(updateClock, 1000);
});`,
  },
};

const DUMMY_TEMPLATE_ID = 'dummy-structured-001';

// ============================================================
// Helper to build a minimal structured template quickly
// ============================================================

interface QuickTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  bodyChildren: StructuredTemplate['dom'];
  cssRules: Array<{ selector: string; declarations: Record<string, string> }>;
  js: string;
  pageTitle: string;
}

function buildStructured(qt: QuickTemplate): StructuredTemplate {
  return {
    dom: {
      type: 'element',
      tag: 'html',
      attributes: { lang: 'en' },
      children: [
        {
          type: 'element',
          tag: 'head',
          attributes: {},
          children: [
            { type: 'element', tag: 'meta', attributes: { charset: 'UTF-8' }, children: [] },
            { type: 'element', tag: 'meta', attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, children: [] },
            { type: 'element', tag: 'title', attributes: {}, children: [{ type: 'text', content: qt.pageTitle }] },
          ],
        },
        {
          type: 'element',
          tag: 'body',
          attributes: {},
          children: [qt.bodyChildren],
        },
      ],
    },
    css: {
      rules: qt.cssRules.map((r, i) => ({ ...r, order: i })),
      variables: {},
      animations: [],
    },
    js: { code: qt.js },
  };
}

// ============================================================
// 5 additional templates
// ============================================================

const extraTemplates: QuickTemplate[] = [
  // 1. Pomodoro Focus Timer
  {
    id: 'tpl-pomodoro-001',
    title: 'Pomodoro Focus Timer',
    description: 'A minimal pomodoro timer with start, pause and reset controls plus a circular progress ring.',
    category: 'Productivity',
    tags: ['timer', 'pomodoro', 'javascript', 'svg'],
    rating: 4.7,
    pageTitle: 'Pomodoro Timer',
    bodyChildren: {
      type: 'element', tag: 'div', attributes: { class: 'pomo-wrap' }, children: [
        { type: 'element', tag: 'h1', attributes: {}, children: [{ type: 'text', content: 'Focus Session' }] },
        { type: 'element', tag: 'div', attributes: { class: 'ring' }, children: [
          { type: 'element', tag: 'svg', attributes: { viewBox: '0 0 200 200', width: '240', height: '240' }, children: [
            { type: 'element', tag: 'circle', attributes: { cx: '100', cy: '100', r: '90', class: 'ring-bg' }, children: [] },
            { type: 'element', tag: 'circle', attributes: { cx: '100', cy: '100', r: '90', class: 'ring-fg', id: 'ring-fg' }, children: [] },
          ]},
          { type: 'element', tag: 'div', attributes: { class: 'time', id: 'time' }, children: [{ type: 'text', content: '25:00' }] },
        ]},
        { type: 'element', tag: 'div', attributes: { class: 'controls' }, children: [
          { type: 'element', tag: 'button', attributes: { id: 'start' }, children: [{ type: 'text', content: 'Start' }] },
          { type: 'element', tag: 'button', attributes: { id: 'pause' }, children: [{ type: 'text', content: 'Pause' }] },
          { type: 'element', tag: 'button', attributes: { id: 'reset' }, children: [{ type: 'text', content: 'Reset' }] },
        ]},
      ],
    },
    cssRules: [
      { selector: '*', declarations: { margin: '0', padding: '0', 'box-sizing': 'border-box' } },
      { selector: 'body', declarations: { 'font-family': 'system-ui, sans-serif', background: 'linear-gradient(135deg,#fff7d6,#ffe27a)', 'min-height': '100vh', display: 'flex', 'align-items': 'center', 'justify-content': 'center' } },
      { selector: '.pomo-wrap', declarations: { background: '#111', color: '#fff', padding: '40px 50px', 'border-radius': '24px', 'text-align': 'center', 'box-shadow': '0 30px 60px rgba(0,0,0,0.25)' } },
      { selector: '.pomo-wrap h1', declarations: { 'font-size': '1.4rem', 'letter-spacing': '4px', 'text-transform': 'uppercase', color: '#ffd54a', 'margin-bottom': '24px' } },
      { selector: '.ring', declarations: { position: 'relative', width: '240px', height: '240px', margin: '0 auto' } },
      { selector: '.ring svg', declarations: { transform: 'rotate(-90deg)' } },
      { selector: '.ring-bg', declarations: { fill: 'none', stroke: '#222', 'stroke-width': '10' } },
      { selector: '.ring-fg', declarations: { fill: 'none', stroke: '#ffd54a', 'stroke-width': '10', 'stroke-linecap': 'round', 'stroke-dasharray': '565.48', 'stroke-dashoffset': '0', transition: 'stroke-dashoffset 1s linear' } },
      { selector: '.time', declarations: { position: 'absolute', inset: '0', display: 'flex', 'align-items': 'center', 'justify-content': 'center', 'font-size': '3rem', 'font-weight': '700' } },
      { selector: '.controls', declarations: { display: 'flex', gap: '10px', 'margin-top': '30px', 'justify-content': 'center' } },
      { selector: '.controls button', declarations: { background: '#ffd54a', color: '#111', border: 'none', padding: '10px 22px', 'border-radius': '999px', cursor: 'pointer', 'font-weight': '600', transition: 'transform .2s' } },
      { selector: '.controls button:hover', declarations: { transform: 'translateY(-2px)' } },
    ],
    js: `
document.addEventListener('DOMContentLoaded', () => {
  const TOTAL = 25 * 60;
  let remaining = TOTAL;
  let interval = null;
  const timeEl = document.getElementById('time');
  const ring = document.getElementById('ring-fg');
  const C = 2 * Math.PI * 90;
  ring.style.strokeDasharray = C;
  function render() {
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    timeEl.textContent = m + ':' + s;
    ring.style.strokeDashoffset = C * (1 - remaining / TOTAL);
  }
  document.getElementById('start').onclick = () => {
    if (interval) return;
    interval = setInterval(() => {
      if (remaining > 0) { remaining--; render(); }
      else { clearInterval(interval); interval = null; }
    }, 1000);
  };
  document.getElementById('pause').onclick = () => { clearInterval(interval); interval = null; };
  document.getElementById('reset').onclick = () => { clearInterval(interval); interval = null; remaining = TOTAL; render(); };
  render();
});`,
  },

  // 2. Todo List
  {
    id: 'tpl-todo-001',
    title: 'Minimal Todo List',
    description: 'A clean todo list with add, complete and delete actions, persisted in memory for the session.',
    category: 'Productivity',
    tags: ['todo', 'list', 'javascript', 'minimal'],
    rating: 4.6,
    pageTitle: 'Todo List',
    bodyChildren: {
      type: 'element', tag: 'div', attributes: { class: 'app' }, children: [
        { type: 'element', tag: 'h1', attributes: {}, children: [{ type: 'text', content: 'Today' }] },
        { type: 'element', tag: 'form', attributes: { id: 'form' }, children: [
          { type: 'element', tag: 'input', attributes: { id: 'input', placeholder: 'What do you want to do?', autocomplete: 'off' }, children: [] },
          { type: 'element', tag: 'button', attributes: { type: 'submit' }, children: [{ type: 'text', content: 'Add' }] },
        ]},
        { type: 'element', tag: 'ul', attributes: { id: 'list' }, children: [] },
        { type: 'element', tag: 'p', attributes: { class: 'count', id: 'count' }, children: [{ type: 'text', content: '0 items' }] },
      ],
    },
    cssRules: [
      { selector: '*', declarations: { margin: '0', padding: '0', 'box-sizing': 'border-box', 'font-family': 'system-ui, sans-serif' } },
      { selector: 'body', declarations: { background: '#faf7ed', 'min-height': '100vh', display: 'flex', 'align-items': 'center', 'justify-content': 'center', padding: '20px' } },
      { selector: '.app', declarations: { background: '#fff', width: '100%', 'max-width': '440px', padding: '32px', 'border-radius': '20px', 'box-shadow': '0 20px 50px rgba(0,0,0,0.08)' } },
      { selector: '.app h1', declarations: { 'font-size': '2rem', 'margin-bottom': '20px', color: '#1a1a1a' } },
      { selector: '#form', declarations: { display: 'flex', gap: '8px', 'margin-bottom': '20px' } },
      { selector: '#input', declarations: { flex: '1', padding: '12px 14px', border: '2px solid #eee', 'border-radius': '10px', 'font-size': '1rem', outline: 'none' } },
      { selector: '#input:focus', declarations: { 'border-color': '#ffcb05' } },
      { selector: '#form button', declarations: { background: '#ffcb05', color: '#111', border: 'none', padding: '0 18px', 'border-radius': '10px', 'font-weight': '600', cursor: 'pointer' } },
      { selector: '#list', declarations: { 'list-style': 'none', display: 'flex', 'flex-direction': 'column', gap: '8px' } },
      { selector: '#list li', declarations: { display: 'flex', 'align-items': 'center', gap: '10px', padding: '12px', background: '#faf7ed', 'border-radius': '10px' } },
      { selector: '#list li.done span', declarations: { 'text-decoration': 'line-through', opacity: '0.5' } },
      { selector: '#list li span', declarations: { flex: '1', cursor: 'pointer' } },
      { selector: '#list li button', declarations: { background: 'transparent', border: 'none', cursor: 'pointer', color: '#c33', 'font-size': '1rem' } },
      { selector: '.count', declarations: { 'margin-top': '16px', color: '#888', 'font-size': '.9rem' } },
    ],
    js: `
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const list = document.getElementById('list');
  const count = document.getElementById('count');
  const items = [];
  function render() {
    list.innerHTML = '';
    items.forEach((it, idx) => {
      const li = document.createElement('li');
      if (it.done) li.classList.add('done');
      const span = document.createElement('span');
      span.textContent = it.text;
      span.onclick = () => { it.done = !it.done; render(); };
      const btn = document.createElement('button');
      btn.textContent = '✕';
      btn.onclick = () => { items.splice(idx, 1); render(); };
      li.append(span, btn);
      list.appendChild(li);
    });
    count.textContent = items.length + ' item' + (items.length === 1 ? '' : 's');
  }
  form.onsubmit = (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    items.push({ text: v, done: false });
    input.value = '';
    render();
  };
  render();
});`,
  },

  // 3. Weather Card
  {
    id: 'tpl-weather-001',
    title: 'Animated Weather Card',
    description: 'A static weather card with animated sun rays and gradient sky background.',
    category: 'UI Components',
    tags: ['weather', 'card', 'animation', 'css'],
    rating: 4.8,
    pageTitle: 'Weather Card',
    bodyChildren: {
      type: 'element', tag: 'div', attributes: { class: 'card' }, children: [
        { type: 'element', tag: 'div', attributes: { class: 'sun' }, children: [] },
        { type: 'element', tag: 'div', attributes: { class: 'info' }, children: [
          { type: 'element', tag: 'p', attributes: { class: 'city' }, children: [{ type: 'text', content: 'Lisbon' }] },
          { type: 'element', tag: 'h1', attributes: { class: 'temp' }, children: [{ type: 'text', content: '24°' }] },
          { type: 'element', tag: 'p', attributes: { class: 'desc' }, children: [{ type: 'text', content: 'Sunny · Light breeze' }] },
        ]},
        { type: 'element', tag: 'div', attributes: { class: 'forecast' }, children: [
          { type: 'element', tag: 'div', attributes: { class: 'day' }, children: [
            { type: 'element', tag: 'p', attributes: {}, children: [{ type: 'text', content: 'Tue' }] },
            { type: 'element', tag: 'p', attributes: {}, children: [{ type: 'text', content: '25°' }] },
          ]},
          { type: 'element', tag: 'div', attributes: { class: 'day' }, children: [
            { type: 'element', tag: 'p', attributes: {}, children: [{ type: 'text', content: 'Wed' }] },
            { type: 'element', tag: 'p', attributes: {}, children: [{ type: 'text', content: '23°' }] },
          ]},
          { type: 'element', tag: 'div', attributes: { class: 'day' }, children: [
            { type: 'element', tag: 'p', attributes: {}, children: [{ type: 'text', content: 'Thu' }] },
            { type: 'element', tag: 'p', attributes: {}, children: [{ type: 'text', content: '21°' }] },
          ]},
        ]},
      ],
    },
    cssRules: [
      { selector: '*', declarations: { margin: '0', padding: '0', 'box-sizing': 'border-box', 'font-family': 'system-ui, sans-serif' } },
      { selector: 'body', declarations: { 'min-height': '100vh', background: '#0e1a2b', display: 'flex', 'align-items': 'center', 'justify-content': 'center' } },
      { selector: '.card', declarations: { width: '320px', background: 'linear-gradient(160deg,#ffd86b,#ff8a3d)', 'border-radius': '24px', padding: '28px', color: '#1a1a1a', position: 'relative', overflow: 'hidden', 'box-shadow': '0 30px 60px rgba(0,0,0,0.3)' } },
      { selector: '.sun', declarations: { position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', 'border-radius': '50%', background: 'radial-gradient(circle,#fff7c0,#ffd86b)', 'box-shadow': '0 0 80px #ffe27a', animation: 'pulse 4s ease-in-out infinite' } },
      { selector: '.info', declarations: { position: 'relative', 'z-index': '1' } },
      { selector: '.city', declarations: { 'text-transform': 'uppercase', 'letter-spacing': '3px', 'font-size': '.85rem', opacity: '.7' } },
      { selector: '.temp', declarations: { 'font-size': '4.5rem', 'font-weight': '700', 'line-height': '1', 'margin-top': '8px' } },
      { selector: '.desc', declarations: { 'margin-top': '6px', 'font-size': '.95rem' } },
      { selector: '.forecast', declarations: { display: 'flex', 'justify-content': 'space-between', 'margin-top': '32px', background: 'rgba(255,255,255,0.25)', padding: '14px', 'border-radius': '14px', 'backdrop-filter': 'blur(8px)' } },
      { selector: '.day p:first-child', declarations: { 'font-size': '.75rem', opacity: '.8' } },
      { selector: '.day p:last-child', declarations: { 'font-weight': '700', 'margin-top': '4px' } },
    ],
    js: `
/* Animation defined via CSS keyframes injected at runtime */
(function(){
  const s = document.createElement('style');
  s.textContent = '@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }';
  document.head.appendChild(s);
})();`,
  },

  // 4. Pricing Cards
  {
    id: 'tpl-pricing-001',
    title: 'Three-Tier Pricing Page',
    description: 'A responsive pricing section with three plans, highlighted recommended tier and hover lift effect.',
    category: 'Marketing',
    tags: ['pricing', 'cards', 'landing', 'css'],
    rating: 4.5,
    pageTitle: 'Pricing',
    bodyChildren: {
      type: 'element', tag: 'section', attributes: { class: 'pricing' }, children: [
        { type: 'element', tag: 'h1', attributes: {}, children: [{ type: 'text', content: 'Choose your plan' }] },
        { type: 'element', tag: 'p', attributes: { class: 'sub' }, children: [{ type: 'text', content: 'Simple pricing. No hidden fees. Cancel anytime.' }] },
        { type: 'element', tag: 'div', attributes: { class: 'grid' }, children: [
          { type: 'element', tag: 'div', attributes: { class: 'plan' }, children: [
            { type: 'element', tag: 'h3', attributes: {}, children: [{ type: 'text', content: 'Starter' }] },
            { type: 'element', tag: 'p', attributes: { class: 'price' }, children: [{ type: 'text', content: '$0' }] },
            { type: 'element', tag: 'ul', attributes: {}, children: [
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: '1 project' }] },
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: 'Community support' }] },
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: 'Basic analytics' }] },
            ]},
            { type: 'element', tag: 'button', attributes: {}, children: [{ type: 'text', content: 'Get started' }] },
          ]},
          { type: 'element', tag: 'div', attributes: { class: 'plan featured' }, children: [
            { type: 'element', tag: 'span', attributes: { class: 'tag' }, children: [{ type: 'text', content: 'Popular' }] },
            { type: 'element', tag: 'h3', attributes: {}, children: [{ type: 'text', content: 'Pro' }] },
            { type: 'element', tag: 'p', attributes: { class: 'price' }, children: [{ type: 'text', content: '$19' }] },
            { type: 'element', tag: 'ul', attributes: {}, children: [
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: 'Unlimited projects' }] },
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: 'Priority support' }] },
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: 'Advanced analytics' }] },
            ]},
            { type: 'element', tag: 'button', attributes: {}, children: [{ type: 'text', content: 'Start free trial' }] },
          ]},
          { type: 'element', tag: 'div', attributes: { class: 'plan' }, children: [
            { type: 'element', tag: 'h3', attributes: {}, children: [{ type: 'text', content: 'Team' }] },
            { type: 'element', tag: 'p', attributes: { class: 'price' }, children: [{ type: 'text', content: '$49' }] },
            { type: 'element', tag: 'ul', attributes: {}, children: [
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: 'Everything in Pro' }] },
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: '10 team members' }] },
              { type: 'element', tag: 'li', attributes: {}, children: [{ type: 'text', content: 'SSO & audit logs' }] },
            ]},
            { type: 'element', tag: 'button', attributes: {}, children: [{ type: 'text', content: 'Contact sales' }] },
          ]},
        ]},
      ],
    },
    cssRules: [
      { selector: '*', declarations: { margin: '0', padding: '0', 'box-sizing': 'border-box', 'font-family': 'system-ui, sans-serif' } },
      { selector: 'body', declarations: { background: '#fafafa', padding: '60px 20px', 'min-height': '100vh' } },
      { selector: '.pricing', declarations: { 'max-width': '1100px', margin: '0 auto', 'text-align': 'center' } },
      { selector: '.pricing h1', declarations: { 'font-size': '2.5rem', color: '#111' } },
      { selector: '.sub', declarations: { color: '#666', 'margin-top': '8px', 'margin-bottom': '40px' } },
      { selector: '.grid', declarations: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px' } },
      { selector: '.plan', declarations: { background: '#fff', padding: '36px 28px', 'border-radius': '18px', border: '1px solid #eee', 'text-align': 'left', transition: 'transform .25s, box-shadow .25s', position: 'relative' } },
      { selector: '.plan:hover', declarations: { transform: 'translateY(-6px)', 'box-shadow': '0 20px 40px rgba(0,0,0,0.08)' } },
      { selector: '.plan h3', declarations: { 'font-size': '1.1rem', color: '#444', 'text-transform': 'uppercase', 'letter-spacing': '2px' } },
      { selector: '.plan .price', declarations: { 'font-size': '3rem', 'font-weight': '700', margin: '14px 0', color: '#111' } },
      { selector: '.plan ul', declarations: { 'list-style': 'none', 'margin-bottom': '24px' } },
      { selector: '.plan li', declarations: { padding: '8px 0', color: '#555', 'border-bottom': '1px solid #f3f3f3' } },
      { selector: '.plan button', declarations: { width: '100%', padding: '12px', background: '#111', color: '#fff', border: 'none', 'border-radius': '10px', cursor: 'pointer', 'font-weight': '600' } },
      { selector: '.plan.featured', declarations: { background: '#111', color: '#fff', border: 'none' } },
      { selector: '.plan.featured h3, .plan.featured .price, .plan.featured li', declarations: { color: '#fff', 'border-color': '#222' } },
      { selector: '.plan.featured button', declarations: { background: '#ffd54a', color: '#111' } },
      { selector: '.tag', declarations: { position: 'absolute', top: '-12px', right: '20px', background: '#ffd54a', color: '#111', 'font-size': '.7rem', padding: '4px 10px', 'border-radius': '999px', 'font-weight': '700', 'letter-spacing': '1px' } },
    ],
    js: `
document.querySelectorAll('.plan button').forEach(b => {
  b.addEventListener('click', () => {
    b.textContent = '✓ Selected';
    setTimeout(() => { b.textContent = b.textContent.replace('✓ Selected', 'Get started'); }, 1500);
  });
});`,
  },

  // 5. Image Gallery with Lightbox
  {
    id: 'tpl-gallery-001',
    title: 'Image Gallery + Lightbox',
    description: 'A masonry-style gallery with click-to-expand lightbox, keyboard navigation and smooth fade transitions.',
    category: 'UI Components',
    tags: ['gallery', 'lightbox', 'images', 'javascript'],
    rating: 4.7,
    pageTitle: 'Gallery',
    bodyChildren: {
      type: 'element', tag: 'div', attributes: { class: 'wrap' }, children: [
        { type: 'element', tag: 'h1', attributes: {}, children: [{ type: 'text', content: 'Field Notes' }] },
        { type: 'element', tag: 'div', attributes: { class: 'gallery', id: 'gallery' }, children: [
          ...['1015','1025','1035','1045','1055','1065','1074','1080'].map(id => ({
            type: 'element' as const, tag: 'img',
            attributes: { src: `https://picsum.photos/id/${id}/600/400`, alt: 'Photo' },
            children: [],
          })),
        ]},
        { type: 'element', tag: 'div', attributes: { class: 'lightbox', id: 'lightbox' }, children: [
          { type: 'element', tag: 'span', attributes: { class: 'close', id: 'close' }, children: [{ type: 'text', content: '✕' }] },
          { type: 'element', tag: 'img', attributes: { id: 'lb-img', src: '', alt: '' }, children: [] },
          { type: 'element', tag: 'span', attributes: { class: 'nav prev', id: 'prev' }, children: [{ type: 'text', content: '‹' }] },
          { type: 'element', tag: 'span', attributes: { class: 'nav next', id: 'next' }, children: [{ type: 'text', content: '›' }] },
        ]},
      ],
    },
    cssRules: [
      { selector: '*', declarations: { margin: '0', padding: '0', 'box-sizing': 'border-box', 'font-family': 'system-ui, sans-serif' } },
      { selector: 'body', declarations: { background: '#fafafa', padding: '40px 20px' } },
      { selector: '.wrap', declarations: { 'max-width': '1100px', margin: '0 auto' } },
      { selector: '.wrap h1', declarations: { 'font-size': '2rem', 'margin-bottom': '24px', color: '#1a1a1a' } },
      { selector: '.gallery', declarations: { columns: '3 250px', 'column-gap': '14px' } },
      { selector: '.gallery img', declarations: { width: '100%', 'margin-bottom': '14px', 'border-radius': '10px', cursor: 'pointer', transition: 'transform .25s, opacity .25s', display: 'block' } },
      { selector: '.gallery img:hover', declarations: { transform: 'scale(1.02)', opacity: '.9' } },
      { selector: '.lightbox', declarations: { position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.92)', display: 'none', 'align-items': 'center', 'justify-content': 'center', 'z-index': '999' } },
      { selector: '.lightbox.open', declarations: { display: 'flex' } },
      { selector: '#lb-img', declarations: { 'max-width': '90%', 'max-height': '90%', 'border-radius': '8px', 'box-shadow': '0 20px 60px rgba(0,0,0,0.6)' } },
      { selector: '.close', declarations: { position: 'absolute', top: '20px', right: '30px', 'font-size': '2rem', color: '#fff', cursor: 'pointer' } },
      { selector: '.nav', declarations: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', 'font-size': '4rem', color: '#fff', cursor: 'pointer', padding: '0 20px', 'user-select': 'none' } },
      { selector: '.prev', declarations: { left: '10px' } },
      { selector: '.next', declarations: { right: '10px' } },
    ],
    js: `
document.addEventListener('DOMContentLoaded', () => {
  const imgs = Array.from(document.querySelectorAll('.gallery img'));
  const box = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  let idx = 0;
  function open(i) { idx = i; lbImg.src = imgs[i].src; box.classList.add('open'); }
  function close() { box.classList.remove('open'); }
  function next() { idx = (idx + 1) % imgs.length; lbImg.src = imgs[idx].src; }
  function prev() { idx = (idx - 1 + imgs.length) % imgs.length; lbImg.src = imgs[idx].src; }
  imgs.forEach((img, i) => img.addEventListener('click', () => open(i)));
  document.getElementById('close').onclick = close;
  document.getElementById('next').onclick = next;
  document.getElementById('prev').onclick = prev;
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
});`,
  },
];

function seedExtraTemplates(): void {
  for (const qt of extraTemplates) {
    if (templateStorage.getById(qt.id)) continue;
    const structured = buildStructured(qt);
    const htmlContent = structuredToHtml(structured);
    const template: Template = {
      id: qt.id,
      title: qt.title,
      description: qt.description,
      thumbnail: '',
      category: qt.category,
      tags: qt.tags,
      htmlContent,
      structuredData: structured,
      isPublic: true,
      isPremium: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      downloads: 0,
      rating: qt.rating,
    };
    templateStorage.save(template);
    console.log('[Seed] Template created:', qt.id);
  }
}

export function seedDummyStructuredTemplate(): void {
  seedExtraTemplates();

  // Don't re-seed if already exists
  if (templateStorage.getById(DUMMY_TEMPLATE_ID)) return;

  const htmlContent = structuredToHtml(dummyStructuredData);

  const template: Template = {
    id: DUMMY_TEMPLATE_ID,
    title: 'Up-Down Counter (Structured JSON)',
    description: 'A glassmorphism counter app built from structured JSON backend response. Features increase, decrease, reset buttons and a live clock.',
    thumbnail: '',
    category: 'Interactive',
    tags: ['counter', 'glassmorphism', 'javascript', 'structured-json', 'demo'],
    htmlContent,
    structuredData: dummyStructuredData,
    isPublic: true,
    isPremium: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    downloads: 0,
    rating: 4.5,
  };

  templateStorage.save(template);
  console.log('[Seed] Dummy structured template created:', DUMMY_TEMPLATE_ID);
}
