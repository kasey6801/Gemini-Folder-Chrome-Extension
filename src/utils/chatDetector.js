// Reads conversation links from Gemini's own sidebar DOM.
// Gemini is a SPA — query live at the moment of use.

// A valid Gemini conversation URL must have /app/ followed by at least 8 characters.
const VALID_CONVERSATION_URL = /https?:\/\/[^/]*gemini\.google\.com\/app\/([a-zA-Z0-9_-]{8,})/;

export function isValidConversationUrl(url) {
  return VALID_CONVERSATION_URL.test(url);
}

function extractId(url) {
  try {
    const match = url.match(/\/app\/([^?#/\s]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function extractTitle(el) {
  // aria-label intentionally excluded — it picks up Google Account labels and
  // other non-conversation accessibility descriptions. Conversation titles live
  // in textContent or a dedicated data attribute.
  const candidates = [
    el.querySelector('[data-conversation-title]')?.textContent,
    el.getAttribute('title'),
    el.textContent,
  ];
  for (const c of candidates) {
    const t = c?.trim();
    if (t && t.length > 0 && t.length < 200) return t;
  }
  return 'Untitled Chat';
}

export function getGeminiChats() {
  const seen = new Set();
  const chats = [];

  function addChat(url, el) {
    if (!url || seen.has(url) || !isValidConversationUrl(url)) return;
    const id = extractId(url);
    if (!id) return;
    const content = extractTitle(el);
    if (content === 'Untitled Chat') return;
    seen.add(url);
    chats.push({ id, content, url, timestamp: Date.now() });
  }

  // Strategy 1: <a> tags with /app/ in href (relative or absolute)
  document.querySelectorAll('a[href*="/app/"]').forEach(el => addChat(el.href, el));

  // Strategy 2: all <a> tags — full URL match against strict pattern
  document.querySelectorAll('a[href]').forEach(el => addChat(el.href, el));

  return chats;
}

// Returns the current conversation, or null if not on a valid Gemini conversation page.
export function getCurrentChat() {
  const url = window.location.href;
  if (!isValidConversationUrl(url)) return null;

  const id = extractId(url);
  if (!id) return null;

  const title =
    document.querySelector('a[href*="/app/"][aria-current]')?.textContent.trim() ||
    document.querySelector('[aria-current="page"]')?.textContent.trim() ||
    document.title.replace(/ [-–|].*$/, '').trim() ||
    null;

  if (!title) return null;

  return { id, content: title, url, timestamp: Date.now() };
}
