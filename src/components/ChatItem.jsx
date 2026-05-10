import { useState } from 'react';
import { Input, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function ChatItem({ chat, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(chat.content);

  function commit() {
    setEditing(false);
    const trimmed = editContent.trim();
    if (trimmed && trimmed !== chat.content) onRename(chat.id, trimmed);
    else setEditContent(chat.content);
  }

  function handleDragStart(e) {
    e.dataTransfer.setData('application/json', JSON.stringify(chat));
    e.dataTransfer.effectAllowed = 'copy';
  }

  return (
    <div className="chat-item" draggable onDragStart={handleDragStart}>
      {editing ? (
        <Input
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
          onBlur={commit}
          onPressEnter={commit}
          autoFocus
          size="small"
          style={{ flex: 1 }}
        />
      ) : (
        <a
          className="chat-link"
          href={chat.url}
          title={chat.content}
          onDoubleClick={e => { e.preventDefault(); setEditing(true); }}
        >
          {chat.content}
        </a>
      )}
      <div className="chat-actions">
        <Popconfirm
          title="Remove from folder?"
          onConfirm={() => onDelete(chat.id)}
          okText="Remove"
          cancelText="Cancel"
        >
          <Tooltip title="Remove">
            <button><DeleteOutlined /></button>
          </Tooltip>
        </Popconfirm>
      </div>
    </div>
  );
}
