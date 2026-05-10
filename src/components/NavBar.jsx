import { Tooltip } from 'antd';
import { FolderOutlined, SettingOutlined } from '@ant-design/icons';

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <div className="nav">
      <img
        className="sidebar-logo"
        src={chrome.runtime.getURL('assets/logo.png')}
        alt="Gemini Folders"
        height={22}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
      <span className="sidebar-title">Gemini Folders</span>
      <div className="nav-tabs">
        <Tooltip title="Folders" placement="bottom">
          <button
            className={`nav-tab${activeTab === 'folders' ? ' active' : ''}`}
            onClick={() => onTabChange('folders')}
          >
            <FolderOutlined />
          </button>
        </Tooltip>
        <Tooltip title="Settings" placement="bottom">
          <button
            className={`nav-tab${activeTab === 'settings' ? ' active' : ''}`}
            onClick={() => onTabChange('settings')}
          >
            <SettingOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
