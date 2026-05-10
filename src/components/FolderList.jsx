import { useState, useEffect } from 'react';
import { Button, Input, Popover, ColorPicker, ConfigProvider, message } from 'antd';
import { PlusOutlined, ExpandAltOutlined, CompressOutlined } from '@ant-design/icons';
import FolderItem from './FolderItem';
import ChatSearch from './ChatSearch';
import RecentChatsList from './RecentChatsList';
import { getFolders, saveFolders } from '../utils/storage';
import { useStorage } from '../hooks/useStorage';
import '../styles/FolderItem.css';

export default function FolderList() {
  const [folders, setFolders] = useState({});
  const [folderOrder, setFolderOrder] = useState([]);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#ca6673');
  const [addOpen, setAddOpen] = useState(false);
  const [expandSignal, setExpandSignal] = useState(null);
  const [showRecent] = useStorage('showRecentChats', true);

  useEffect(() => {
    load();
    const listener = changes => {
      if (changes.folders) setFolders(changes.folders.newValue || {});
      if (changes.folderOrder) setFolderOrder(changes.folderOrder.newValue || []);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  async function load() {
    const { folders, folderOrder } = await getFolders();
    setFolders(folders);
    setFolderOrder(folderOrder);
  }

  async function addFolder() {
    const name = newName.trim();
    if (!name) return;
    if (folders[name]) { message.warning('A folder with that name already exists.'); return; }
    const updated = {
      ...folders,
      [name]: { color: newColor, items: [], subFolders: {}, level: 0, parent: null },
    };
    const order = [...folderOrder, name];
    await saveFolders(updated, order);
    setFolders(updated);
    setFolderOrder(order);
    setNewName('');
    setAddOpen(false);
  }

  async function deleteFolder(name) {
    const updated = { ...folders };
    delete updated[name];
    const order = folderOrder.filter(n => n !== name);
    await saveFolders(updated, order);
    setFolders(updated);
    setFolderOrder(order);
  }

  async function renameFolder(oldName, newName) {
    if (!newName || newName === oldName || folders[newName]) return;
    const updated = { ...folders, [newName]: folders[oldName] };
    delete updated[oldName];
    const order = folderOrder.map(n => (n === oldName ? newName : n));
    await saveFolders(updated, order);
    setFolders(updated);
    setFolderOrder(order);
  }

  async function updateFolder(name, patch) {
    const updated = { ...folders, [name]: { ...folders[name], ...patch } };
    await saveFolders(updated, folderOrder);
    setFolders(updated);
  }

  async function reorderFolder(draggedName, targetName) {
    const order = folderOrder.filter(n => n !== draggedName);
    const targetIndex = order.indexOf(targetName);
    order.splice(targetIndex, 0, draggedName);
    await saveFolders(folders, order);
    setFolderOrder(order);
  }

  const orderedFolders = folderOrder.filter(n => folders[n]);

  const addContent = (
    <div style={{ width: 220 }}>
      <Input
        placeholder="Folder name"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        onPressEnter={addFolder}
        autoFocus
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>Color</span>
        <ConfigProvider getPopupContainer={() => document.body}>
          <ColorPicker value={newColor} onChange={(_, hex) => setNewColor(hex)} size="small" placement="bottomRight" />
        </ConfigProvider>
      </div>
      <Button type="primary" size="small" block onClick={addFolder}>
        Create Folder
      </Button>
    </div>
  );

  return (
    <div className="folder-list">
      <div className="folder-list-header">
        <ChatSearch folders={folders} />
        <button className="add-folder-btn" title="Expand all"
          onClick={() => setExpandSignal({ type: 'expand', v: Date.now() })}>
          <ExpandAltOutlined />
        </button>
        <button className="add-folder-btn" title="Collapse all"
          onClick={() => setExpandSignal({ type: 'collapse', v: Date.now() })}>
          <CompressOutlined />
        </button>
        <Popover
          content={addContent}
          trigger="click"
          open={addOpen}
          onOpenChange={setAddOpen}
          placement="bottomRight"
        >
          <button className="add-folder-btn folderPopover2" title="New folder">
            <PlusOutlined />
          </button>
        </Popover>
      </div>
      <div className="folder-list-body">
        {showRecent && <RecentChatsList />}
        {orderedFolders.map(name => (
          <FolderItem
            key={name}
            name={name}
            folder={folders[name]}
            expandSignal={expandSignal}
            onDelete={deleteFolder}
            onRename={renameFolder}
            onUpdate={updateFolder}
            onReorder={reorderFolder}
          />
        ))}
        {orderedFolders.length === 0 && (
          <div className="empty-state">No folders yet. Click + to create one.</div>
        )}
      </div>
    </div>
  );
}
