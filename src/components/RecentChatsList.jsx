import { useState, useEffect } from 'react';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { getGeminiChats } from '../utils/chatDetector';

export default function RecentChatsList() {
  const [chats, setChats] = useState([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setChats(getGeminiChats());
  }, []);

  function handleDragStart(e, chat) {
    e.dataTransfer.setData('application/json', JSON.stringify(chat));
    e.dataTransfer.effectAllowed = 'copy';
  }

  if (chats.length === 0) return null;

  return (
    <div className="recent-chats-section">
      <div className="recent-chats-header" onClick={() => setExpanded(v => !v)}>
        <span className="recent-chats-expand-icon">
          {expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
        </span>
        <span className="recent-chats-title">Recent Chats</span>
        <span className="folder-count">{chats.length}</span>
      </div>
      {expanded && (
        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat.id}
              className="chat-item"
              draggable
              onDragStart={e => handleDragStart(e, chat)}
            >
              <a
                className="chat-link"
                href={chat.url}
                title={chat.content}
              >
                {chat.content}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
