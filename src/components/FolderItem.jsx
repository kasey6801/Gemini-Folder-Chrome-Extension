import { useState, useEffect } from 'react';
import { ConfigProvider, ColorPicker, Input, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import ChatItem from './ChatItem';
import AddChatsModal from './AddChatsModal';

export default function FolderItem({ name, folder, expandSignal, onDelete, onRename, onUpdate, onReorder }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expandSignal) return;
    setExpanded(expandSignal.type === 'expand');
  }, [expandSignal]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [addChatsOpen, setAddChatsOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [folderDragOver, setFolderDragOver] = useState(false);

  function commitRename() {
    setEditing(false);
    const trimmed = editName.trim();
    if (trimmed && trimmed !== name) onRename(name, trimmed);
    else setEditName(name);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer.types.includes('application/folder-name')) {
      setFolderDragOver(true);
    } else {
      setDragOver(true);
    }
  }

  function handleDragLeave() {
    setDragOver(false);
    setFolderDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    setFolderDragOver(false);

    // Folder reorder — check first so it doesn't conflict with chat drops
    const folderName = e.dataTransfer.getData('application/folder-name');
    if (folderName && folderName !== name) {
      onReorder(folderName, name);
      return;
    }

    // Our own dragged ChatItem
    const json = e.dataTransfer.getData('application/json');
    if (json) {
      try {
        const chat = JSON.parse(json);
        if (!folder.items.find(c => c.id === chat.id)) {
          onUpdate(name, { items: [...folder.items, chat] });
        }
        return;
      } catch { /* fall through */ }
    }

    // Native browser link drag (Gemini sidebar links): read URL from standard MIME types
    const uriList = e.dataTransfer.getData('text/uri-list');
    const plainText = e.dataTransfer.getData('text/plain');
    const html = e.dataTransfer.getData('text/html');
    const url = (uriList || plainText || '').split('\n')[0].trim();

    if (url && url.includes('/app/')) {
      const match = url.match(/\/app\/([^?#/\s]+)/);
      if (!match) return;
      const id = match[1];
      if (folder.items.find(c => c.id === id)) return;

      // Try to extract the link label from the HTML drag payload
      let content = 'Untitled Chat';
      if (html) {
        const m = html.match(/>([^<]{3,})</);
        if (m) content = m[1].trim();
      } else if (plainText && plainText !== url) {
        content = plainText.trim();
      }

      onUpdate(name, { items: [...folder.items, { id, content, url, timestamp: Date.now() }] });
    }
  }

  function removeChat(chatId) {
    onUpdate(name, { items: folder.items.filter(c => c.id !== chatId) });
  }

  function renameChat(chatId, content) {
    onUpdate(name, { items: folder.items.map(c => (c.id === chatId ? { ...c, content } : c)) });
  }

  function addChats(chats) {
    const existing = new Set(folder.items.map(c => c.id));
    const merged = [...folder.items, ...chats.filter(c => !existing.has(c.id))];
    onUpdate(name, { items: merged });
  }

  const classes = [
    'folder-item',
    dragOver ? 'drag-over' : '',
    folderDragOver ? 'folder-drag-over' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className="folder-header"
        draggable
        onDragStart={e => {
          e.stopPropagation();
          e.dataTransfer.setData('application/folder-name', name);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragEnd={() => { setDragOver(false); setFolderDragOver(false); }}
        onClick={() => !editing && setExpanded(v => !v)}
      >
        <span className="folder-expand-icon">
          {expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
        </span>
        <span className="folder-color-dot" style={{ background: folder.color }} />

        {editing ? (
          <Input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commitRename}
            onPressEnter={commitRename}
            onClick={e => e.stopPropagation()}
            size="small"
            autoFocus
            style={{ flex: 1 }}
          />
        ) : (
          <span className="folder-name">{name}</span>
        )}

        <span className="folder-count">{folder.items.length}</span>

        <div className="folder-actions" onClick={e => e.stopPropagation()}>
          <Tooltip title="Rename">
            <button onClick={() => { setEditing(true); setEditName(name); }}>
              <EditOutlined />
            </button>
          </Tooltip>
          <ConfigProvider getPopupContainer={() => document.body}>
            <ColorPicker
              value={folder.color}
              onChange={(_, hex) => onUpdate(name, { color: hex })}
              size="small"
              placement="bottomRight"
            />
          </ConfigProvider>
          <Tooltip title="Add chats">
            <button onClick={() => setAddChatsOpen(true)}>
              <PlusOutlined />
            </button>
          </Tooltip>
          <Popconfirm
            title={`Delete "${name}"?`}
            description="This removes the folder and all its chat links."
            onConfirm={() => onDelete(name)}
            okText="Delete"
            cancelText="Cancel"
          >
            <button><DeleteOutlined /></button>
          </Popconfirm>
        </div>
      </div>

      {expanded && (
        <div className="chat-list">
          {folder.items.map(chat => (
            <ChatItem key={chat.id} chat={chat} onDelete={removeChat} onRename={renameChat} />
          ))}
          {folder.items.length === 0 && (
            <div className="empty-folder">Drop chats here or click + to add.</div>
          )}
        </div>
      )}

      <AddChatsModal
        open={addChatsOpen}
        onClose={() => setAddChatsOpen(false)}
        existingChats={folder.items}
        onAdd={addChats}
      />
    </div>
  );
}
