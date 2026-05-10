import DarkModeToggle from './DarkModeToggle';
import RecentChatsToggle from './RecentChatsToggle';
import OpenOnStartup from './OpenOnStartup';
import '../../styles/Settings.css';

export default function Settings() {
  return (
    <div className="settings-view">
      <h3 className="settings-title">Settings</h3>
      <div className="settings-contents">
        <DarkModeToggle />
        <RecentChatsToggle />
        <OpenOnStartup />
      </div>
    </div>
  );
}
