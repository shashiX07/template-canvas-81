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

export function seedDummyStructuredTemplate(): void {
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
