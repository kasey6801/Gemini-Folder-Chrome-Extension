import { useState, useRef } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../styles/ChatSearch.css';

export default function ChatSearch({ folders }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const results = query.trim()
    ? Object.entries(folders).flatMap(([folderName, folder]) =>
        (folder.items || [])
          .filter(c => c.content.toLowerCase().includes(query.toLowerCase()))
          .map(c => ({ ...c, folderName }))
      )
    : [];

  function handleBlur(e) {
    if (!wrapRef.current?.contains(e.relatedTarget)) {
      setOpen(false);
    }
  }

  return (
    <div className="chat-search" ref={wrapRef} onBlur={handleBlur}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search chats…"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        allowClear
        size="small"
      />
      {open && query.trim() && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="no-results">No chats found.</div>
          ) : (
            results.map(chat => (
              <a
                key={`${chat.folderName}-${chat.id}`}
                href={chat.url}
                className="search-result-item"
                onClick={() => { setQuery(''); setOpen(false); }}
              >
                <span className="result-title">{chat.content}</span>
                <span className="result-folder">{chat.folderName}</span>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
