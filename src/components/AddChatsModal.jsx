import { useState, useEffect } from 'react';
import { Modal, Checkbox, Input, Button, Divider } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { getGeminiChats, getCurrentChat } from '../utils/chatDetector';

export default function AddChatsModal({ open, onClose, existingChats, onAdd }) {
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');

  useEffect(() => {
    if (!open) return;
    const existingIds = new Set(existingChats.map(c => c.id));
    const detected = getGeminiChats().filter(c => !existingIds.has(c.id));
    const current = getCurrentChat(); // null when not on a conversation page
    const hasCurrent = current && detected.some(c => c.id === current.id);
    const all = (current && !hasCurrent && !existingIds.has(current.id))
      ? [current, ...detected]
      : detected;
    setAvailable(all);
    setSelected([]);
    setQuery('');
    setManualUrl('');
    setManualTitle('');
  }, [open]);

  const filtered = available.filter(c =>
    c.content.toLowerCase().includes(query.toLowerCase())
  );

  function toggle(chat) {
    setSelected(prev =>
      prev.find(c => c.id === chat.id)
        ? prev.filter(c => c.id !== chat.id)
        : [...prev, chat]
    );
  }

  function addManual() {
    const url = manualUrl.trim();
    if (!url) return;
    const match = url.match(/\/app\/([^?#/]+)/);
    const id = match ? match[1] : url;
    const content = manualTitle.trim() || url;
    const chat = { id, content, url, timestamp: Date.now() };
    if (!selected.find(c => c.id === id) && !available.find(c => c.id === id)) {
      setAvailable(prev => [chat, ...prev]);
    }
    setSelected(prev => prev.find(c => c.id === id) ? prev : [...prev, chat]);
    setManualUrl('');
    setManualTitle('');
  }

  function confirm() {
    onAdd(selected);
    onClose();
  }

  return (
    <Modal
      title="Add Chats to Folder"
      open={open}
      onCancel={onClose}
      onOk={confirm}
      okText={`Add ${selected.length || ''} Chat${selected.length !== 1 ? 's' : ''}`}
      okButtonProps={{ disabled: selected.length === 0 }}
      getContainer={() => document.getElementById('gemini-sidebar') || document.body}
    >
      {/* Detected chats */}
      <Input
        prefix={<SearchOutlined />}
        placeholder="Filter detected chats…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        allowClear
        style={{ marginBottom: 8 }}
      />
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
        {filtered.map(chat => (
          <div key={chat.id} style={{ padding: '4px 0' }}>
            <Checkbox
              checked={!!selected.find(c => c.id === chat.id)}
              onChange={() => toggle(chat)}
            >
              {chat.content}
            </Checkbox>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--muted-text-color)', padding: '12px 0', fontSize: 12 }}>
            {available.length === 0
              ? 'No conversations auto-detected. Use the form below to add manually.'
              : 'No chats match your filter.'}
          </div>
        )}
      </div>

      {/* Manual URL entry */}
      <Divider style={{ margin: '8px 0', fontSize: 11, color: 'var(--muted-text-color)' }}>
        or add by URL
      </Divider>
      <Input
        placeholder="Paste Gemini chat URL…"
        value={manualUrl}
        onChange={e => setManualUrl(e.target.value)}
        onPressEnter={addManual}
        style={{ marginBottom: 6 }}
      />
      <Input
        placeholder="Chat title (optional)"
        value={manualTitle}
        onChange={e => setManualTitle(e.target.value)}
        onPressEnter={addManual}
        style={{ marginBottom: 6 }}
        suffix={
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={addManual}
            disabled={!manualUrl.trim()}
          >
            Add
          </Button>
        }
      />
    </Modal>
  );
}
