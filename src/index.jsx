import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';

function init() {
  if (document.getElementById('gemini-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.id = 'gemini-sidebar';
  const root = document.createElement('div');
  root.id = 'root';
  sidebar.appendChild(root);
  document.body.appendChild(sidebar);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap';
  document.head.appendChild(fontLink);

  const toggle = document.createElement('button');
  toggle.id = 'toggle-sidebar';
  toggle.textContent = '☰';
  toggle.title = 'Gemini Folders';
  document.body.appendChild(toggle);

  let open = false;

  function show() {
    open = true;
    sidebar.style.display = 'flex';
    toggle.style.right = '310px';
  }

  function hide() {
    open = false;
    sidebar.style.display = 'none';
    toggle.style.right = '16px';
  }

  toggle.addEventListener('click', () => (open ? hide() : show()));

  chrome.storage.local.get('isOpenOnStartup', ({ isOpenOnStartup }) => {
    isOpenOnStartup ? show() : hide();
  });

  createRoot(root).render(<Sidebar />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
