import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import NavBar from './NavBar';
import FolderList from './FolderList';
import Settings from './settings/Settings';
import { useStorage } from '../hooks/useStorage';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('folders');
  const [darkMode] = useStorage('darkMode', true);

  useEffect(() => {
    const el = document.getElementById('gemini-sidebar');
    if (el) el.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ConfigProvider
      theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}
      getPopupContainer={() => document.getElementById('gemini-sidebar') || document.body}
    >
      <div className="sidebar-inner">
        <NavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="sidebar-content">
          {activeTab === 'folders' && <FolderList />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </ConfigProvider>
  );
}
