import { Switch } from 'antd';
import { useStorage } from '../../hooks/useStorage';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useStorage('darkMode', true);
  return (
    <div className="settings-row dark-mode-toggle">
      <span>Dark Mode</span>
      <Switch checked={!!darkMode} onChange={setDarkMode} />
    </div>
  );
}
